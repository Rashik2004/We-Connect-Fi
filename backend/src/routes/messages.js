const express = require('express');
const router = express.Router();
const {
  getDirectMessages,
  getGroupMessages,
  handleAttachmentUpload,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { uploadAttachment } = require('../middleware/upload');

router.use(protect);

router.get('/direct/:userId', getDirectMessages);
router.get('/group/:groupId', getGroupMessages);
router.post('/attachments', uploadAttachment.single('file'), handleAttachmentUpload);
router.delete('/:messageId', deleteMessage);

module.exports = router;

