import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import Avatar from '../../ui/Avatar';
import { clsx } from 'clsx';

const MessageList = ({ messages, currentUserId, typingUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="px-4 py-1 rounded-full bg-gray-200 dark:bg-dark-700 text-xs text-gray-600 dark:text-gray-400">
              {format(new Date(date), 'MMMM d, yyyy')}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {msgs.map((message, index) => {
              const isSent = message.sender._id === currentUserId;
              const showAvatar = !isSent && (
                index === msgs.length - 1 ||
                msgs[index + 1]?.sender._id !== message.sender._id
              );

              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={clsx(
                    'flex gap-2 items-end',
                    isSent ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isSent && (
                    <div className="w-8 h-8">
                      {showAvatar && (
                        <Avatar
                          src={message.sender.avatar}
                          alt={message.sender.username}
                          size="sm"
                        />
                      )}
                    </div>
                  )}

                  <div
                    className={clsx(
                      'flex flex-col',
                      isSent ? 'items-end' : 'items-start'
                    )}
                  >
                    {/* Message Bubble */}
                    <div
                      className={clsx(
                        'message-bubble',
                        isSent ? 'sent' : 'received'
                      )}
                    >
                      {!isSent && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {message.sender.username}
                        </p>
                      )}

                      {message.fileUrl && (
                        <div className="mb-2">
                          {message.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                              src={message.fileUrl}
                              alt="Attachment"
                              className="max-w-xs rounded-lg"
                            />
                          ) : (
                            <a
                              href={message.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-300 underline"
                            >
                              📎 View Attachment
                            </a>
                          )}
                        </div>
                      )}

                      {(message.content || message.text) && (
                        <p>{message.content || message.text}</p>
                      )}
                    </div>

                    {/* Time and Status */}
                    <div className="flex items-center gap-1 mt-1 px-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.createdAt)}
                      </span>
                      {isSent && (
                        <span className="text-cyan-500">
                          {(message.readBy?.length ?? 0) > 0 ? (
                            <FaCheckDouble className="text-xs" />
                          ) : (
                            <FaCheck className="text-xs" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <Avatar src={typingUser.avatar} alt={typingUser.username} size="sm" />
            <div className="message-bubble received flex items-center gap-1">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
