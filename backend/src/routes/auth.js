const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.post('/register', uploadAvatar.single('avatar'), register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
