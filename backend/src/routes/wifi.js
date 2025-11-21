const express = require('express');
const router = express.Router();
const { getNetworkUsers, getWiFiGroup } = require('../controllers/wifiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/users', getNetworkUsers);
router.get('/group', getWiFiGroup);

module.exports = router;
