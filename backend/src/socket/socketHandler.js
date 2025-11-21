const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const wifiService = require('../services/wifiService');
const { getClientIP } = require('../utils/networkDetection');
const { getDirectKey, getGroupKey, encryptContent } = require('../utils/encryption');

// Store active socket connections
const activeUsers = new Map(); // userId -> { socketId, subnet }
const typingUsers = new Map(); // roomId -> Set of userIds

const buildWifiUsersPayload = (wifiGroup) => {
  if (!wifiGroup) return [];
  return wifiGroup.members
    .filter((member) => member.isActive && member.user)
    .map((member) => ({
      _id: member.user._id,
      username: member.user.username,
      avatar: member.user.avatar,
      isOnline: member.user.isOnline,
      status: member.user.status,
      deviceInfo: member.user.deviceInfo,
      joinedAt: member.joinedAt,
    }));
};

const emitWifiState = async (io, subnet, targetSocket = null) => {
  if (!subnet) return;
  const wifiGroup = await wifiService.getWiFiGroupDetails(subnet);
  if (!wifiGroup) return;

  const payload = {
    wifiGroup: {
      _id: wifiGroup._id,
      name: wifiGroup.name,
      subnet: wifiGroup.subnet,
      activeMembers: wifiGroup.activeMembers,
    },
    users: buildWifiUsersPayload(wifiGroup),
  };

  const emitter = targetSocket || io.to(`wifi:${subnet}`);
  emitter.emit('wifi-group-update', { wifiGroup: payload.wifiGroup });
  emitter.emit('wifi-users-update', { subnet: subnet, users: payload.users });
};

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`✅ User connected: ${user.username} (${socket.id})`);

    // Update user online status
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Store active connection
    activeUsers.set(userId, {
      socketId: socket.id,
      subnet: null
    });

    // Join WiFi network
    socket.on('join-wifi', async ({ ipAddress, ssid, subnet }) => {
      try {
        let clientIP = ipAddress || getClientIP(socket.handshake);

        // For development/localhost, use a default subnet if IP detection fails
        if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1') {
          if (process.env.ALLOW_LOOPBACK === 'true') {
            clientIP = '192.168.1.100'; // Default for localhost testing
          } else {
            socket.emit('wifi-group-joined', {
              wifiGroup: null,
              error: 'Cannot detect network. Please ensure you are on a local network.'
            });
            return;
          }
        }

        const wifiGroup = await wifiService.joinWiFiGroup(userId, clientIP, ssid, subnet);

        if (wifiGroup) {
          const roomName = `wifi:${wifiGroup.subnet}`;
          socket.join(roomName);

          // Store subnet
          const userConnection = activeUsers.get(userId);
          if (userConnection) {
            userConnection.subnet = wifiGroup.subnet;
          }

          // Emit WiFi state update
          await emitWifiState(io, wifiGroup.subnet, socket);

          // Notify other users in the group
          socket.to(roomName).emit('user-joined-network', {
            user: {
              _id: userId,
              username: user.username,
              avatar: user.avatar,
              deviceInfo: user.deviceInfo,
              isOnline: true,
              status: user.status
            },
            wifiGroup: {
              _id: wifiGroup._id,
              name: wifiGroup.name,
              subnet: wifiGroup.subnet
            }
          });

          // Send current group state
          socket.emit('wifi-group-joined', {
            wifiGroup: {
              _id: wifiGroup._id,
              name: wifiGroup.name,
              subnet: wifiGroup.subnet,
              activeMembers: wifiGroup.activeMembers,
              members: wifiGroup.members
            }
          });
        }
      } catch (error) {
        console.error('Error joining WiFi:', error);
        socket.emit('error', { message: 'Failed to join WiFi network: ' + error.message });
      }
    });

    // Leave WiFi network
    socket.on('leave-wifi', async ({ subnet }) => {
      try {
        await wifiService.leaveWiFiGroup(userId, subnet);

        const roomName = `wifi:${subnet}`;
        socket.leave(roomName);

        // Notify others
        socket.to(roomName).emit('user-left-network', {
          userId,
          username: user.username
        });

        await emitWifiState(io, subnet);
      } catch (error) {
        console.error('Error leaving WiFi:', error);
      }
    });

    socket.on('get-wifi-users', async () => {
      const userConnection = activeUsers.get(userId);
      if (!userConnection?.subnet) {
        socket.emit('wifi-users-update', { subnet: null, users: [] });
        return;
      }
      await emitWifiState(io, userConnection.subnet, socket);
    });

    // Send message (DM)
    socket.on('send-message', async ({ recipientId, content, messageType, fileUrl, fileName, fileSize }) => {
      try {
        const encryptionKey = getDirectKey(userId, recipientId);
        const encryptedContent = encryptContent(content, encryptionKey);

        const message = await Message.create({
          sender: userId,
          recipient: recipientId,
          content,
          encryptedContent,
          messageType: messageType || 'text',
          fileUrl,
          fileName,
          fileSize
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar')
          .populate('recipient', 'username avatar');

        // Send to recipient if online
        const recipientConnection = activeUsers.get(recipientId);
        if (recipientConnection) {
          io.to(recipientConnection.socketId).emit('receive-message', populatedMessage);
        }

        // Confirm to sender
        socket.emit('message-sent', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Send group message
    socket.on('send-group-message', async ({ wifiGroupId, content, messageType, fileUrl, fileName, fileSize }) => {
      try {
        const encryptionKey = getGroupKey(wifiGroupId);
        const encryptedContent = encryptContent(content, encryptionKey);

        const message = await Message.create({
          sender: userId,
          wifiGroup: wifiGroupId,
          content,
          encryptedContent,
          messageType: messageType || 'text',
          fileUrl,
          fileName,
          fileSize
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar')
          .populate('wifiGroup', 'name subnet');

        // Broadcast to WiFi group
        const subnet = populatedMessage.wifiGroup.subnet;
        io.to(`wifi:${subnet}`).emit('receive-group-message', populatedMessage);
      } catch (error) {
        console.error('Error sending group message:', error);
        socket.emit('error', { message: 'Failed to send group message' });
      }
    });

    // Typing indicator (DM)
    socket.on('typing', ({ recipientId, isTyping }) => {
      const recipientConnection = activeUsers.get(recipientId);
      if (recipientConnection) {
        io.to(recipientConnection.socketId).emit('user-typing', {
          userId,
          username: user.username,
          isTyping
        });
      }
    });

    // Typing indicator (Group)
    socket.on('typing-group', ({ subnet, isTyping }) => {
      const roomName = `wifi:${subnet}`;
      socket.to(roomName).emit('user-typing-group', {
        userId,
        username: user.username,
        isTyping
      });
    });

    // Mark message as read
    socket.on('mark-read', async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);

        if (message) {
          const alreadyRead = message.readBy.some(r => r.user.toString() === userId);

          if (!alreadyRead) {
            message.readBy.push({ user: userId, readAt: new Date() });
            await message.save();

            // Notify sender
            const senderConnection = activeUsers.get(message.sender.toString());
            if (senderConnection) {
              io.to(senderConnection.socketId).emit('message-read', {
                messageId,
                readBy: userId,
                readAt: new Date()
              });
            }
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Friend request notification
    socket.on('friend-request-sent', ({ recipientId, requestId }) => {
      const recipientConnection = activeUsers.get(recipientId);
      if (recipientConnection) {
        io.to(recipientConnection.socketId).emit('friend-request-received', {
          requestId,
          sender: {
            _id: userId,
            username: user.username,
            avatar: user.avatar
          }
        });
      }
    });

    // Disconnect handler
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${user.username} (${socket.id})`);

      // Update user online status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Get user's subnet before removing
      const userConnection = activeUsers.get(userId);
      if (userConnection && userConnection.subnet) {
        const roomName = `wifi:${userConnection.subnet}`;

        // Notify others in WiFi group
        socket.to(roomName).emit('user-left-network', {
          userId,
          username: user.username
        });

        // Leave WiFi group
        await wifiService.leaveWiFiGroup(userId, userConnection.subnet);
        await emitWifiState(io, userConnection.subnet);
      }

      // Remove from active users
      activeUsers.delete(userId);
    });
  });
};

module.exports = socketHandler;
