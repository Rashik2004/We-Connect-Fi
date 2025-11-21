const Message = require('../models/Message');
const WiFiGroup = require('../models/WiFiGroup');

/**
 * Fetch direct messages between authenticated user and another user
 */
exports.getDirectMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, before } = req.query;

    const query = {
      isDeleted: false,
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar');

    res.json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load messages',
    });
  }
};

/**
 * Fetch WiFi group messages
 */
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = 50, before } = req.query;

    const wifiGroup = await WiFiGroup.findById(groupId);
    if (!wifiGroup) {
      return res.status(404).json({
        success: false,
        message: 'WiFi group not found',
      });
    }

    const query = { wifiGroup: groupId, isDeleted: false };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load group messages',
    });
  }
};

/**
 * Handle secure upload response (multer already processed file)
 */
exports.handleAttachmentUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.status(201).json({
      success: true,
      file: {
        url: `${req.protocol}://${req.get('host')}/uploads/attachments/${req.file.filename}`,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Attachment upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload attachment',
    });
  }
};

/**
 * Soft delete message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages',
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
    });
  }
};

