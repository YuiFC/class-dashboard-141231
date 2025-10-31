const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');


// 受保护的路由：创建新帖子
router.post('/', auth, postController.createPost);

// 公开的路由：获取所有帖子
router.get('/', postController.getAllPosts);

// 公开的路由：获取单个帖子及其评论
router.get('/:id', postController.getPostById);

// 受保护的路由：创建评论
router.post('/:id/comments', auth, commentController.createComment);

module.exports = router;