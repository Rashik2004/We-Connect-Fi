const WiFiGroup = require('../models/WiFiGroup');
const User = require('../models/User');
const { getSubnetFromIP, generateGroupName } = require('../utils/networkDetection');

class WiFiService {
  /**
   * Join or create WiFi group based on user's network
   */
  async joinWiFiGroup(userId, ipAddress, ssid = null, subnetOverride = null) {
    try {
      const subnet = subnetOverride || getSubnetFromIP(ipAddress);

      if (!subnet) {
        throw new Error('Invalid IP address or local network');
      }

      // Find or create WiFi group
      let wifiGroup = await WiFiGroup.findOne({ subnet });

      if (!wifiGroup) {
        const groupName = generateGroupName(subnet, ssid);
        wifiGroup = await WiFiGroup.create({
          name: groupName,
          subnet,
          ssid: ssid || 'Unknown Network',
          members: [{
            user: userId,
            joinedAt: new Date(),
            isActive: true
          }],
          activeMembers: 1,
          lastActivity: new Date()
        });
      } else {
        // Check if user is already a member
        const existingMember = wifiGroup.members.find(
          m => m.user.toString() === userId.toString()
        );

        if (existingMember) {
          existingMember.isActive = true;
          existingMember.joinedAt = new Date();
        } else {
          wifiGroup.members.push({
            user: userId,
            joinedAt: new Date(),
            isActive: true
          });
        }

        await wifiGroup.updateActiveMemberCount();
        wifiGroup.lastActivity = new Date();
        wifiGroup.isActive = true;
        await wifiGroup.save();
      }

      // Update user's current network and history
      await User.findByIdAndUpdate(userId, {
        'currentNetwork.subnet': subnet,
        'currentNetwork.ssid': ssid || 'Unknown Network',
        'currentNetwork.ipAddress': ipAddress,
        'currentNetwork.lastConnected': new Date(),
        $push: {
          networkHistory: {
            $each: [{
              subnet,
              ssid: ssid || 'Unknown Network',
              connectedAt: new Date()
            }],
            $slice: -50
          }
        }
      }, { new: true });

      return await wifiGroup.populate('members.user', 'username avatar isOnline deviceInfo status');
    } catch (error) {
      console.error('Error joining WiFi group:', error);
      throw error;
    }
  }

  /**
   * Leave WiFi group
   */
  async leaveWiFiGroup(userId, subnet) {
    try {
      const wifiGroup = await WiFiGroup.findOne({ subnet });

      if (!wifiGroup) return null;

      const memberIndex = wifiGroup.members.findIndex(
        m => m.user.toString() === userId.toString()
      );

      if (memberIndex !== -1) {
        wifiGroup.members[memberIndex].isActive = false;
        await wifiGroup.updateActiveMemberCount();

        // If no active members, mark group as inactive
        if (wifiGroup.activeMembers === 0) {
          wifiGroup.isActive = false;
        }

        await wifiGroup.save();
      }

      // Clear user's current network
      await User.findByIdAndUpdate(
        userId,
        {
          $unset: { currentNetwork: '' },
        },
      );

      await User.updateOne(
        { _id: userId },
        {
          $set: { 'networkHistory.$[entry].disconnectedAt': new Date() },
        },
        {
          arrayFilters: [
            {
              'entry.subnet': subnet,
              'entry.disconnectedAt': { $exists: false },
            },
          ],
        },
      );

      return wifiGroup;
    } catch (error) {
      console.error('Error leaving WiFi group:', error);
      throw error;
    }
  }

  /**
   * Get users on same WiFi network
   */
  async getUsersOnNetwork(subnet, currentUserId) {
    try {
      const wifiGroup = await WiFiGroup.findOne({ subnet })
        .populate({
          path: 'members.user',
          select: 'username avatar isOnline deviceInfo status friends privacySettings',
          match: { 'privacySettings.visibleOnNetwork': true }
        });

      if (!wifiGroup) return [];

      // Filter active members and check friendship status
      const currentUser = await User.findById(currentUserId);
      const users = wifiGroup.members
        .filter(m => m.isActive && m.user && m.user._id.toString() !== currentUserId.toString())
        .map(m => ({
          ...m.user.toObject(),
          isFriend: currentUser.friends.some(f => f.toString() === m.user._id.toString()),
          joinedAt: m.joinedAt
        }));

      return users;
    } catch (error) {
      console.error('Error getting users on network:', error);
      throw error;
    }
  }

  /**
   * Get WiFi group details
   */
  async getWiFiGroupDetails(subnet) {
    try {
      const wifiGroup = await WiFiGroup.findOne({ subnet })
        .populate('members.user', 'username avatar isOnline deviceInfo status');

      return wifiGroup;
    } catch (error) {
      console.error('Error getting WiFi group details:', error);
      throw error;
    }
  }

  /**
   * Cleanup inactive WiFi groups (called by cron job)
   */
  async cleanupInactiveGroups() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await WiFiGroup.deleteMany({
        isActive: false,
        lastActivity: { $lt: oneDayAgo }
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} inactive WiFi groups`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up WiFi groups:', error);
      throw error;
    }
  }
}

module.exports = new WiFiService();
