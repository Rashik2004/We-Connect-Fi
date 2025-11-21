const os = require('os');

/**
 * Extract subnet from IP address
 * @param {string} ip - IP address
 * @returns {string} Subnet (e.g., "192.168.1")
 */
const getSubnetFromIP = (ip) => {
  if (!ip) {
    return null;
  }

  let normalizedIP = ip;

  if (ip.startsWith('::ffff:')) {
    normalizedIP = ip.replace('::ffff:', '');
  }

  if (ip === '::1') {
    normalizedIP = '127.0.0.1';
  }

  const allowLoopback = process.env.ALLOW_LOOPBACK === 'true';
  if (!allowLoopback && (normalizedIP === '127.0.0.1')) {
    return null;
  }

  // For IPv4
  if (normalizedIP.includes('.')) {
    const parts = normalizedIP.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
  }

  // For IPv6 - simplified
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return parts.slice(0, 4).join(':');
    }
  }

  return null;
};

/**
 * Get client IP from request
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.address ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    req.ip
  );
};

/**
 * Get network interfaces
 * @returns {Array} Network interfaces
 */
const getNetworkInterfaces = () => {
  const interfaces = os.networkInterfaces();
  const networks = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (!net.internal && net.family === 'IPv4') {
        networks.push({
          name,
          address: net.address,
          subnet: getSubnetFromIP(net.address),
          mac: net.mac
        });
      }
    }
  }

  return networks;
};

/**
 * Generate WiFi group name based on subnet
 * @param {string} subnet - Network subnet
 * @param {string} ssid - Optional SSID
 * @returns {string} Group name
 */
const generateGroupName = (subnet, ssid = null) => {
  if (ssid) {
    return `${ssid} Network`;
  }

  // Generate name based on subnet
  const subnetParts = subnet.split('.');
  const lastOctet = subnetParts[subnetParts.length - 1];

  // Common network patterns
  if (subnet.startsWith('192.168.1')) {
    return 'Home WiFi - Main Floor';
  } else if (subnet.startsWith('10.0')) {
    return 'Campus Network - Building A';
  } else if (subnet.startsWith('172.16')) {
    return 'Hostel WiFi - Block B';
  }

  return `Local Network ${lastOctet}`;
};

/**
 * Detect device type from user agent
 * @param {string} userAgent - User agent string
 * @returns {string} Device type
 */
const detectDeviceType = (userAgent) => {
  if (!userAgent) return 'laptop';

  const ua = userAgent.toLowerCase();

  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'phone';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
    return ua.includes('mobile') ? 'laptop' : 'desktop';
  }

  return 'laptop';
};

module.exports = {
  getSubnetFromIP,
  getClientIP,
  getNetworkInterfaces,
  generateGroupName,
  detectDeviceType
};
