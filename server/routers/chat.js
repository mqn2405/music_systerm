const express =  require('express');
const chatController = require('../controllers/chat');
const router = express.Router();

router.get('/user/list/:userId', chatController.getAllUserHaveChat);
router.get('/user', chatController.getChatByUserId);
router.post('/user/reply/:userId', chatController.createUserChatReply);

module.exports = router;