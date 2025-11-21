import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import socketService from '../../../services/socket';
import UserCard from './UserCard';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import ChatWindow from '../chat/ChatWindow';
import toast from 'react-hot-toast';
import { fetchWifiUsers, fetchWifiGroup, sendFriendRequest } from '../../../services/api';

const WiFiUsers = () => {
  const [wifiUsers, setWifiUsers] = useState([]);
  const [wifiGroup, setWifiGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadNetworkData = async () => {
      setLoading(true);
      try {
        const [usersResponse, groupResponse] = await Promise.allSettled([
          fetchWifiUsers(),
          fetchWifiGroup(),
        ]);

        if (!isMounted) return;

        if (usersResponse.status === 'fulfilled') {
          setWifiUsers(usersResponse.value.users);
        }

        if (groupResponse.status === 'fulfilled') {
          setWifiGroup(groupResponse.value);
        }
      } catch (error) {
        console.error('Failed to load WiFi users', error);
        toast.error('Unable to fetch WiFi network details.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNetworkData();
    socketService.emit('get-wifi-users');

    const handleUsersUpdate = ({ users }) => {
      setWifiUsers(users);
      setLoading(false);
    };

    const handleGroupUpdate = ({ wifiGroup: group }) => {
      setWifiGroup(group);
    };

    socketService.on('wifi-users-update', handleUsersUpdate);
    socketService.on('wifi-group-update', handleGroupUpdate);

    return () => {
      isMounted = false;
      socketService.off('wifi-users-update', handleUsersUpdate);
      socketService.off('wifi-group-update', handleGroupUpdate);
    };
  }, []);

  const handleSendMessage = (user) => {
    navigate(`/app/chats?user=${user._id}`);
  };

  const handleAddFriend = async (user) => {
    try {
      await sendFriendRequest({ recipientId: user._id });
      socketService.notifyFriendRequest({ recipientId: user._id });
      toast.success(`Friend request sent to ${user.username}`);
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
      {/* Header */}
      <div>
        <Card glass neon>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <FaWifi className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  WiFi Network Users
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {wifiGroup?.name || 'Connected to your network'}
                </p>
              </div>
            </div>
            <Badge variant="neon" size="lg">
              <FaUsers className="mr-2" />
              {wifiUsers.length} Online
            </Badge>
          </div>
        </Card>
      </div>

      {/* WiFi Group Info */}
      {wifiGroup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <FaWifi className="text-cyan-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {wifiGroup.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Network: {wifiGroup.subnet || 'Local Network'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {wifiUsers.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
              <FaUsers className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Waiting for other users to connect to this network...
            </p>
          </Card>
        ) : (
          wifiUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <UserCard
                user={user}
                onSendMessage={handleSendMessage}
                onAddFriend={handleAddFriend}
                isFriend={user.isFriend}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Live Group Chat */}
      {wifiGroup && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {wifiGroup.name} – Live Channel
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chat with everyone connected to this WiFi
              </p>
            </div>
            <Badge variant="outline" size="sm">
              {wifiGroup.activeMembers || wifiUsers.length} Active
            </Badge>
          </div>
          <div className="h-[600px] border border-gray-200 dark:border-dark-700 rounded-2xl overflow-hidden">
            <Card className="h-full !p-0">
              <ChatWindow
                chatType="wifi"
                selectedUser={{
                  _id: wifiGroup._id,
                  username: wifiGroup.name,
                  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=wifi-group',
                  isOnline: true,
                  subnet: wifiGroup.subnet,
                }}
              />
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default WiFiUsers;
