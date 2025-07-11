const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateTokenHandler');
const {
  createChatroom,
  getChatrooms,
  getChatroomById,
} = require('../controllers/chatroomController');
const sendMessage = require('../controllers/messageController');

router.use(validateToken); // All chatroom routes are protected

router.post('/', createChatroom);
router.get('/', getChatrooms);
router.get('/:id', getChatroomById);
router.post('/:id/message', sendMessage);

module.exports = router;
