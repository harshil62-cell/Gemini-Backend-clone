const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateTokenHandler');
const {
  createChatroom,
  getChatrooms,
  getChatroomById,
} = require('../controllers/chatroomController');

router.use(validateToken); // All chatroom routes are protected

router.post('/', createChatroom);
router.get('/', getChatrooms);
router.get('/:id', getChatroomById);

module.exports = router;
