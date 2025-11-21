import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaBell, FaWifi, FaCheck, FaVolumeUp, FaVolumeMute, FaBellSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { getSettings, updatePrivacySettings, updateNotificationSettings } from '../../../services/api';
import useAuthStore from '../../../stores/authStore';
import { format } from 'date-fns';

const SettingsPage = () => {
  const { user, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowFriendRequests: true,
    visibleOnNetwork: true
  });
  const [notificationSettings, setNotificationSettings] = useState({
    popup: true,
    sound: true,
    silent: false
  });
  const [networkInfo, setNetworkInfo] = useState({
    current: null,
    history: []
  });
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      setPrivacySettings(settings.privacy || privacySettings);
      setNotificationSettings(settings.notifications || notificationSettings);
      setNetworkInfo(settings.network || networkInfo);
    } catch (error) {
      console.error('Failed to load settings', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async (field, value) => {
    try {
      const updated = { ...privacySettings, [field]: value };
      setPrivacySettings(updated);
      await updatePrivacySettings({ [field]: value });
      await fetchUser(); // Refresh user data
      toast.success('Privacy settings updated');
    } catch (error) {
      console.error('Failed to update privacy settings', error);
      toast.error('Failed to update privacy settings');
      // Revert on error
      setPrivacySettings(privacySettings);
    }
  };

  const handleNotificationUpdate = async (field, value) => {
    try {
      let updated = { ...notificationSettings };

      // Handle mutual exclusivity
      if (field === 'silent' && value === true) {
        updated = { ...updated, silent: true, sound: false };
      } else if (field === 'sound' && value === true) {
        updated = { ...updated, sound: true, silent: false };
      } else {
        updated[field] = value;
      }

      setNotificationSettings(updated);
      await updateNotificationSettings(updated);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings', error);
      toast.error('Failed to update notification settings');
      setNotificationSettings(notificationSettings);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gray-300 dark:bg-dark-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const NotificationOption = ({ icon: Icon, label, description, selected, onClick, disabled }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20'
          : 'border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 hover:border-gray-300 dark:hover:border-dark-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          selected ? 'bg-cyan-500/20' : 'bg-gray-100 dark:bg-dark-600'
        }`}>
          <Icon className={`text-xl ${selected ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'}`} />
        </div>
        <div className="flex-1 text-left">
          <p className={`font-medium ${selected ? 'text-cyan-500' : 'text-gray-900 dark:text-white'}`}>
            {label}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {selected && (
          <FaCheck className="text-cyan-500 text-xl" />
        )}
      </div>
    </motion.button>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your account preferences and privacy
          </p>
        </div>

        {/* Privacy Settings */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <FaLock className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Control who can see your profile and send you messages
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleSwitch
              enabled={privacySettings.showOnlineStatus}
              onChange={(value) => handlePrivacyUpdate('showOnlineStatus', value)}
              label="Show Online Status"
              description="Let others see when you're online"
            />
            <div className="border-t border-gray-200 dark:border-dark-600"></div>
            <ToggleSwitch
              enabled={privacySettings.allowFriendRequests}
              onChange={(value) => handlePrivacyUpdate('allowFriendRequests', value)}
              label="Allow Friend Requests"
              description="Let others send you friend requests"
            />
            <div className="border-t border-gray-200 dark:border-dark-600"></div>
            <ToggleSwitch
              enabled={privacySettings.visibleOnNetwork}
              onChange={(value) => handlePrivacyUpdate('visibleOnNetwork', value)}
              label="Visible on WiFi Network"
              description="Show your profile to users on the same network"
            />
          </div>
        </Card>

        {/* Notification Settings */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <FaBell className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <NotificationOption
              icon={FaBell}
              label="Popup Notifications"
              description="Show browser notifications for new messages"
              selected={notificationSettings.popup}
              onClick={() => handleNotificationUpdate('popup', !notificationSettings.popup)}
            />
            <NotificationOption
              icon={FaVolumeUp}
              label="Sound Notifications"
              description="Play sound when receiving messages"
              selected={notificationSettings.sound && !notificationSettings.silent}
              onClick={() => handleNotificationUpdate('sound', !notificationSettings.sound)}
              disabled={notificationSettings.silent}
            />
            <NotificationOption
              icon={FaBellSlash}
              label="Silent Mode"
              description="Disable all notification sounds"
              selected={notificationSettings.silent}
              onClick={() => handleNotificationUpdate('silent', !notificationSettings.silent)}
            />
          </div>
        </Card>

        {/* Network Settings */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <FaWifi className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Network
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View your WiFi connection details and history
              </p>
            </div>
          </div>

          {/* Current Network */}
          {networkInfo.current && networkInfo.current.subnet ? (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Current Connection
              </h4>
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Network Name (SSID)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {networkInfo.current.ssid || 'Unknown Network'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subnet</p>
                    <p className="font-semibold text-gray-900 dark:text-white font-mono">
                      {networkInfo.current.subnet}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white font-mono">
                      {networkInfo.current.ipAddress || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Connected</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {networkInfo.current.lastConnected
                        ? format(new Date(networkInfo.current.lastConnected), 'PPp')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-xl bg-gray-100 dark:bg-dark-600 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Not connected to any network
              </p>
            </div>
          )}

          {/* Network History */}
          {networkInfo.history && networkInfo.history.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Network History
                </h4>
                <button
                  onClick={() => setActiveModal('network-history')}
                  className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {networkInfo.history.slice(0, 5).map((network, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {network.ssid || 'Unknown Network'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {network.subnet}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {network.connectedAt
                            ? format(new Date(network.connectedAt), 'MMM d, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Network History Modal */}
      <Modal
        isOpen={activeModal === 'network-history'}
        onClose={() => setActiveModal(null)}
        title="Network History"
        size="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {networkInfo.history && networkInfo.history.length > 0 ? (
            networkInfo.history.map((network, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {network.ssid || 'Unknown Network'}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {network.connectedAt
                      ? format(new Date(network.connectedAt), 'PPp')
                      : 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Subnet</p>
                    <p className="font-mono text-gray-900 dark:text-white">{network.subnet}</p>
                  </div>
                  {network.disconnectedAt && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Disconnected</p>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(network.disconnectedAt), 'PPp')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No network history available
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;

