import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  neon = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300',
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-dark-700 shadow-lg border border-gray-200 dark:border-dark-600',
        neon && 'neon-border',
        hover && 'cursor-pointer hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
