import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import Avatar from '../../ui/Avatar';
import { clsx } from 'clsx';

const UserList = ({ users, selectedUser, onSelectUser, showSearch = true }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700">
      {/* Search */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 focus:outline-none focus:border-cyan-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
              onClick={() => onSelectUser(user)}
              className={clsx(
                'p-4 border-b border-gray-200 dark:border-dark-700 cursor-pointer transition-colors',
                selectedUser?._id === user._id &&
                  'bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-l-cyan-500'
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  alt={user.username}
                  size="md"
                  status={user.isOnline ? 'online' : 'offline'}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {user.username}
                  </h4>
                  {user.lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.lastMessage}
                    </p>
                  )}
                </div>
                {user.unreadCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-semibold">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
