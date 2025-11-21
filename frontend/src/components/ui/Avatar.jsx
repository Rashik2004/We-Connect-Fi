import { clsx } from 'clsx';
import { FaUser } from 'react-icons/fa';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className = '',
  onClick,
}) => {
  const sizes = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };
  
  return (
    <div className={clsx('relative inline-block', className)} onClick={onClick}>
      <div
        className={clsx(
          'rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-semibold',
          sizes[size],
          onClick && 'cursor-pointer hover:scale-105 transition-transform'
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <FaUser />
        )}
      </div>
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-dark-800',
            'status-indicator',
            status === 'online' && 'online',
            status === 'offline' && 'offline'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
