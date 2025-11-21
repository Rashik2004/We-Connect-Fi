const wifiService = require('../services/wifiService');
const { getClientIP, getSubnetFromIP } = require('../utils/networkDetection');

// @desc    Get users on same WiFi network
// @route   GET /api/wifi/users
// @access  Private
exports.getNetworkUsers = async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const subnet = getSubnetFromIP(clientIP);

    if (!subnet) {
      return res.status(400).json({
        success: false,
        message: 'Cannot detect network'
      });
    }

    const users = await wifiService.getUsersOnNetwork(subnet, req.user._id);

    res.json({
      success: true,
      subnet,
      users
    });
  } catch (error) {
    console.error('Get network users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get WiFi group details
// @route   GET /api/wifi/group
// @access  Private
exports.getWiFiGroup = async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const subnet = getSubnetFromIP(clientIP);

    if (!subnet) {
      return res.status(400).json({
        success: false,
        message: 'Cannot detect network'
      });
    }

    const wifiGroup = await wifiService.getWiFiGroupDetails(subnet);

    if (!wifiGroup) {
      return res.status(404).json({
        success: false,
        message: 'WiFi group not found'
      });
    }

    res.json({
      success: true,
      wifiGroup
    });
  } catch (error) {
    console.error('Get WiFi group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = exports;
