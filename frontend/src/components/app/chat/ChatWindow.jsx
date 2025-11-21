import { useState, useEffect } from 'react';
import { FaPhone, FaVideo, FaEllipsisV, FaWifi } from 'react-icons/fa';
import toast from 'react-hot-toast';
import socketService from '../../../services/socket';
import useAuthStore from '../../../stores/authStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Avatar from '../../ui/Avatar';
import Badge from '../../ui/Badge';
import {
  fetchDirectMessages,
  fetchGroupMessages,
  uploadAttachment,
} from '../../../services/api';

const ChatWindow = ({ selectedUser, chatType = 'direct' }) => {
  const { user: currentUser } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!selectedUser) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let loaded = [];
        if (chatType === 'wifi') {
          loaded = await fetchGroupMessages(selectedUser._id);
        } else {
          loaded = await fetchDirectMessages(selectedUser._id);
        }

        if (isMounted) {
          setMessages(loaded);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
        toast.error('Unable to load messages right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedUser, chatType]);

  useEffect(() => {
    if (!selectedUser) return undefined;

    const incomingEvent = chatType === 'wifi' ? 'receive-group-message' : 'receive-message';
    const typingEvent = chatType === 'wifi' ? 'user-typing-group' : 'user-typing';

    const onIncomingMessage = (message) => {
      if (chatType === 'wifi') {
        if (message.wifiGroup?._id === selectedUser._id) {
          setMessages((prev) => [...prev, message]);
        }
      } else {
        const isForConversation =
          (message.sender?._id === selectedUser._id && message.recipient?._id === currentUser._id) ||
          (message.recipient?._id === selectedUser._id && message.sender?._id === currentUser._id);

        if (isForConversation) {
          setMessages((prev) => [...prev, message]);
        }
      }
    };

    const onTyping = ({ userId, isTyping, username }) => {
      if (chatType === 'wifi') {
        setTypingUser(isTyping ? { username } : null);
      } else if (userId === selectedUser._id) {
        setTypingUser(isTyping ? selectedUser : null);
      }
    };

    socketService.on(incomingEvent, onIncomingMessage);
    socketService.on(typingEvent, onTyping);

    return () => {
      socketService.off(incomingEvent, onIncomingMessage);
      socketService.off(typingEvent, onTyping);
    };
  }, [selectedUser, chatType, currentUser]);

  const handleSendMessage = async ({ text, file }) => {
    if ((!text || !text.trim()) && !file) return;

    let attachmentPayload = {};

    if (file) {
      try {
        const uploaded = await uploadAttachment(file);
        attachmentPayload = {
          fileUrl: uploaded.url,
          fileName: uploaded.originalName,
          fileSize: uploaded.size,
          messageType: file.type?.startsWith('image/') ? 'image' : 'file',
        };
      } catch (error) {
        console.error('Attachment upload failed', error);
        toast.error('Failed to upload file');
        return;
      }
    }

    const payload = {
      content: text?.trim() || '',
      ...attachmentPayload,
    };

    if (chatType === 'wifi') {
      payload.wifiGroupId = selectedUser._id;
      socketService.sendGroupMessage(payload);
    } else {
      payload.recipientId = selectedUser._id;
      socketService.sendMessage(payload);
    }
  };

  const handleTyping = (isTyping) => {
    if (chatType === 'wifi') {
      socketService.sendTypingGroup({
        subnet: selectedUser.subnet,
        isTyping,
      });
      return;
    }

    socketService.sendTyping({
      recipientId: selectedUser._id,
      isTyping,
    });
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-dark-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <FaWifi className="text-4xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to We-Connect-Fi
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a user to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-900">
      {/* Chat Header */}
      <div className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={selectedUser.avatar}
            alt={selectedUser.username}
            size="md"
            status={selectedUser.isOnline ? 'online' : 'offline'}
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedUser.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          {chatType === 'wifi' && (
            <Badge variant="neon" size="sm">
              <FaWifi className="mr-1" />
              WiFi Chat
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <FaPhone className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <FaVideo className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <FaEllipsisV className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUserId={currentUser._id}
          typingUser={typingUser}
        />
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!selectedUser || (chatType !== 'wifi' && !selectedUser.isOnline)}
      />
    </div>
  );
};

export default ChatWindow;
