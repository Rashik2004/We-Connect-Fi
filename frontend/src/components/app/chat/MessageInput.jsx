import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import Button from '../../ui/Button';

const MessageInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Emit typing indicator
    if (onTyping) {
      onTyping(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((!message.trim() && !attachedFile) || disabled) return;

    onSendMessage({
      text: message.trim(),
      file: attachedFile,
    });

    setMessage('');
    setAttachedFile(null);
    if (onTyping) onTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
      {/* File Preview */}
      {attachedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 p-2 bg-gray-100 dark:bg-dark-700 rounded-lg flex items-center justify-between"
        >
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            📎 {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            className="text-red-500 hover:text-red-600"
          >
            ✕
          </button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* File Upload */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
        >
          <FaPaperclip className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Chat is disabled' : 'Type a message...'}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 dark:bg-dark-700 border-2 border-transparent focus:border-cyan-500 focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          {/* Emoji Button (placeholder) */}
          <button
            type="button"
            className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FaSmile className="text-xl" />
          </button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={(!message.trim() && !attachedFile) || disabled}
          className="!px-4 !py-3"
        >
          <FaPaperPlane className="text-xl" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
