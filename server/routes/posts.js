const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// 受保护的路由：创建新帖子
router.post('/', auth, postController.createPost);

// 公开的路由：获取所有帖子
router.get('/', postController.getAllPosts);

module.exports = router;