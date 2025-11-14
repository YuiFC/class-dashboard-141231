// server/routes/events.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth'); // 导入“门卫”

// 1. 创建新日程 (POST /api/events) - 受保护
// 只有登录的用户才能创建日程
router.post('/', auth, eventController.createEvent);

// 2. 获取所有日程 (GET /api/events) - 公开
// 任何人都可以查看班级日程
router.get('/', eventController.getAllEvents);

module.exports = router;