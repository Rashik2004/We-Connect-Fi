import { clsx } from 'clsx';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-gray-200',
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-gray-900',
    danger: 'bg-red-500 text-white',
    neon: 'bg-transparent border-2 border-cyan-400 text-cyan-400 neon-glow',
    outline: 'border border-gray-400 text-gray-600 dark:text-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
