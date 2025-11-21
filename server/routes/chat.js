// server/routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth'); // 引入门卫

// POST /api/chat
// 受保护的路由：只有登录的同学才能和 AI 聊天
router.post('/', auth, chatController.chat);

module.exports = router;