const express = require('express');
const router = express.Router();
const {
  getSettings,
  updatePrivacySettings,
  updateNotificationSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSettings);
router.put('/privacy', updatePrivacySettings);
router.put('/notifications', updateNotificationSettings);

module.exports = router;

