import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  FaComments,
  FaUsers,
  FaWifi,
  FaUserFriends,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { clsx } from 'clsx';
import useAuthStore from '../../../stores/authStore';
import Avatar from '../../ui/Avatar';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      name: 'Chats',
      path: '/app/chats',
      icon: <FaComments />,
    },
    {
      name: 'WiFi Users',
      path: '/app/wifi-users',
      icon: <FaWifi />,
    },
    {
      name: 'Friends',
      path: '/app/friends',
      icon: <FaUserFriends />,
    },
    {
      name: 'Discover',
      path: '/app/discover',
      icon: <FaUsers />,
    },
    {
      name: 'Settings',
      path: '/app/settings',
      icon: <FaCog />,
    },
  ];

  return (
    <div className="h-full w-20 lg:w-72 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <FaWifi className="text-white text-xl" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold neon-text">We-Connect-Fi</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Local Network Messenger
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <NavLink
          to="/app/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            size="md"
            status="online"
          />
          <div className="hidden lg:block flex-1 overflow-hidden">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-xl">{item.icon}</span>
                    <span className="hidden lg:block font-medium">
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
