import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from './layout/Sidebar';
import ChatWindow from './chat/ChatWindow';
import UserList from './users/UserList';
import WiFiUsers from './users/WiFiUsers';
import ProfileView from './profile/ProfileView';
import ProfileEdit from './profile/ProfileEdit';
import SettingsPage from './settings/SettingsPage';
import Card from '../ui/Card';
import {
  getFriends,
  fetchWifiUsers,
  getFriendRequests,
  respondToFriendRequest,
} from '../../services/api';
import socketService from '../../services/socket';

// Placeholder components for routes not yet implemented
const ChatsPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await getFriends();
        setUsers(friends);
      } catch (error) {
        console.error('Failed to load friends', error);
        toast.error('Unable to load your friends list.');
      }
    };

    loadFriends();
  }, []);

  useEffect(() => {
    if (!location.search) return;
    const params = new URLSearchParams(location.search);
    const userId = params.get('user');
    if (!userId || users.length === 0) return;
    const targetUser = users.find((user) => user._id === userId);
    if (targetUser) {
      setSelectedUser(targetUser);
    }
  }, [location.search, users]);

  return (
    <div className="flex h-full">
      <div className="w-80">
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>
      <div className="flex-1">
        <ChatWindow selectedUser={selectedUser} chatType="direct" />
      </div>
    </div>
  );
};

const FriendsPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [requests, currentFriends] = await Promise.all([
        getFriendRequests(),
        getFriends(),
      ]);
      setFriendRequests(requests);
      setFriends(currentFriends);
    } catch (error) {
      console.error('Failed to load friend data', error);
      toast.error('Unable to load friend data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      await respondToFriendRequest(requestId, action);
      toast.success(`Request ${action === 'accept' ? 'accepted' : 'declined'}`);
      loadData();
    } catch (error) {
      console.error('Failed to update friend request', error);
      toast.error('Unable to update friend request');
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Friend Requests
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Accept or decline new connection requests
          </p>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse text-gray-400">Loading requests...</div>
            ) : friendRequests.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No pending requests at the moment.
                </p>
              </Card>
            ) : (
              friendRequests.map((request) => (
                <Card key={request._id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {request.sender.username}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.sender.status || 'Available'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded-xl bg-neon-blue/10 text-neon-blue"
                      onClick={() => handleRequestAction(request._id, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-dark-700 text-white"
                      onClick={() => handleRequestAction(request._id, 'decline')}
                    >
                      Decline
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Friends
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            See who is online across your networks
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="animate-pulse text-gray-400">Loading friends...</div>
            ) : friends.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No friends yet. Start connecting on your WiFi.
                </p>
              </Card>
            ) : (
              friends.map((friend) => (
                <Card key={friend._id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {friend.username}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {friend.isOnline ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    onClick={() => navigate(`/app/chats?user=${friend._id}`)}
                  >
                    Message
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscoverPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Discover
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Find new people to connect with
        </p>
      </div>
    </div>
  );
};


const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ProfileEdit
        onCancel={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  return <ProfileView onEdit={() => setIsEditing(true)} />;
};

const Dashboard = () => {
  useEffect(() => {
    const joinNetwork = async () => {
      if (!socketService.isConnected()) return;

      try {
        // Try to get current network info
        const data = await fetchWifiUsers();
        if (data?.subnet) {
          socketService.joinWiFi({ subnet: data.subnet });
        } else {
          // Auto-detect and join
          socketService.joinWiFi({});
        }
      } catch (error) {
        // Silently fail - user might not be on a network yet
        console.warn('Unable to auto join WiFi group', error?.message);
      }
    };

    const handleConnect = () => {
      joinNetwork();
    };

    if (socketService.isConnected()) {
      joinNetwork();
    }

    socketService.on('connect', handleConnect);

    return () => {
      socketService.off('connect', handleConnect);
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-dark-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/app/chats" replace />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/wifi-users" element={<WiFiUsers />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/app/chats" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
