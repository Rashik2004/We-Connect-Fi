import { motion } from 'framer-motion';
import { FaEdit, FaCalendar, FaEnvelope, FaWifi } from 'react-icons/fa';
import { format } from 'date-fns';
import useAuthStore from '../../../stores/authStore';
import Avatar from '../../ui/Avatar';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

const ProfileView = ({ onEdit }) => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header Card */}
        <Card glass neon>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="xl"
              status="online"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.username}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="primary">
                  <FaWifi className="mr-1" />
                  Online
                </Badge>
                <Badge variant="default">
                  {user.friends?.length || 0} Friends
                </Badge>
                <Badge variant="default">
                  {user.wifiConnections?.length || 0} WiFi Connections
                </Badge>
              </div>
            </div>
            
            <Button
              variant="outline"
              icon={<FaEdit />}
              onClick={onEdit}
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FaCalendar className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.dateOfBirth ? format(new Date(user.dateOfBirth), 'MMMM d, yyyy') : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Total Messages</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {user.stats?.totalMessages || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">WiFi Groups Joined</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {user.stats?.wifiGroupsJoined || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent WiFi Connections */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent WiFi Connections
          </h3>
          <div className="space-y-2">
            {user.recentWifiGroups && user.recentWifiGroups.length > 0 ? (
              user.recentWifiGroups.map((group, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <FaWifi className="text-cyan-500 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {group.subnet}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(group.lastConnected), 'MMM d, HH:mm')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent connections
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileView;
