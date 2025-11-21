import { FaLaptop, FaMobileAlt, FaUserPlus, FaComment } from 'react-icons/fa';
import Avatar from '../../ui/Avatar';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const UserCard = ({ user, onSendMessage, onAddFriend, isFriend = false }) => {
  const deviceType = user?.deviceInfo?.type || user?.device || 'laptop';
  const deviceIcon = deviceType === 'phone' || deviceType === 'mobile' ? <FaMobileAlt /> : <FaLaptop />;

  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar
          src={user?.avatar}
          alt={user?.username}
          size="lg"
          status={user?.isOnline ? 'online' : 'offline'}
        />

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.username}
            </h3>
            {isFriend && (
              <Badge variant="success" size="sm">
                Friend
              </Badge>
            )}
          </div>

          {user?.bio && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
              {user?.bio}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              {deviceIcon}
              {deviceType}
            </span>
            {user?.wifiGroup && (
              <>
                <span>•</span>
                <span className="truncate">{user.wifiGroup}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {onSendMessage && (
            <Button
              variant="primary"
              size="sm"
              icon={<FaComment />}
              onClick={() => onSendMessage(user)}
            >
              Message
            </Button>
          )}
          {onAddFriend && !isFriend && (
            <Button
              variant="outline"
              size="sm"
              icon={<FaUserPlus />}
              onClick={() => onAddFriend(user)}
            >
              Add Friend
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
