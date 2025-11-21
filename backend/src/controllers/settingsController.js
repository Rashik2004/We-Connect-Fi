const User = require('../models/User');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('privacySettings notificationSettings currentNetwork networkHistory');

    res.json({
      success: true,
      settings: {
        privacy: user.privacySettings,
        notifications: user.notificationSettings || {
          popup: true,
          sound: true,
          silent: false
        },
        network: {
          current: user.currentNetwork,
          history: user.networkHistory || []
        }
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/settings/privacy
// @access  Private
exports.updatePrivacySettings = async (req, res) => {
  try {
    const { showOnlineStatus, allowFriendRequests, visibleOnNetwork } = req.body;

    const updateData = {};
    if (typeof showOnlineStatus === 'boolean') {
      updateData['privacySettings.showOnlineStatus'] = showOnlineStatus;
    }
    if (typeof allowFriendRequests === 'boolean') {
      updateData['privacySettings.allowFriendRequests'] = allowFriendRequests;
    }
    if (typeof visibleOnNetwork === 'boolean') {
      updateData['privacySettings.visibleOnNetwork'] = visibleOnNetwork;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('privacySettings');

    res.json({
      success: true,
      privacySettings: user.privacySettings
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/settings/notifications
// @access  Private
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { popup, sound, silent } = req.body;

    const updateData = {};
    if (typeof popup === 'boolean') {
      updateData['notificationSettings.popup'] = popup;
    }
    if (typeof sound === 'boolean') {
      updateData['notificationSettings.sound'] = sound;
    }
    if (typeof silent === 'boolean') {
      updateData['notificationSettings.silent'] = silent;
      // If silent is true, disable sound
      if (silent) {
        updateData['notificationSettings.sound'] = false;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, upsert: true }
    ).select('notificationSettings');

    res.json({
      success: true,
      notificationSettings: user.notificationSettings || {
        popup: true,
        sound: true,
        silent: false
      }
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

