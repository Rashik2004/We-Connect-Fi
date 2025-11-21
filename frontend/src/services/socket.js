import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Join WiFi network
  joinWiFi(data) {
    this.socket?.emit('join-wifi', data);
  }

  // Leave WiFi network
  leaveWiFi(data) {
    this.socket?.emit('leave-wifi', data);
  }

  emit(event, payload) {
    this.socket?.emit(event, payload);
  }

  // Send DM
  sendMessage(data) {
    this.socket?.emit('send-message', data);
  }

  // Send group message
  sendGroupMessage(data) {
    this.socket?.emit('send-group-message', data);
  }

  // Typing indicator (DM)
  sendTyping(data) {
    this.socket?.emit('typing', data);
  }

  // Typing indicator (Group)
  sendTypingGroup(data) {
    this.socket?.emit('typing-group', data);
  }

  // Mark message as read
  markAsRead(messageId) {
    this.socket?.emit('mark-read', { messageId });
  }

  // Friend request sent notification
  notifyFriendRequest(data) {
    this.socket?.emit('friend-request-sent', data);
  }

  // Listen to events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  // Remove listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove from stored listeners
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
