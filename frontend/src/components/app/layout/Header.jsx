import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaBell, FaSearch } from 'react-icons/fa';
import useThemeStore from '../../../stores/themeStore';

const Header = ({ title, subtitle }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 flex items-center justify-between">
      {/* Title */}
      <div>
        {title && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-700">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
          <FaBell className="text-xl text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
        >
          {theme === 'dark' ? (
            <FaSun className="text-xl text-yellow-500" />
          ) : (
            <FaMoon className="text-xl text-purple-600" />
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
