const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriend
} = require('../controllers/friendsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/request', sendFriendRequest);
router.get('/requests', getFriendRequests);
router.put('/accept/:requestId', acceptFriendRequest);
router.put('/decline/:requestId', declineFriendRequest);
router.get('/', getFriends);
router.delete('/:friendId', removeFriend);

module.exports = router;
