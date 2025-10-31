// server/controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const authorId = req.user.id; // 来自 auth 中间件

    // 1. 检查帖子是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '未找到该帖子' });
    }

    // 2. 创建新评论
    const newComment = new Comment({
      content: content,
      author: authorId,
      post: postId
    });

    // 3. 保存评论
    await newComment.save();

    // 4. [推荐] 立即填充作者信息并返回，这样前端就不用再次请求了
    await newComment.populate('author', 'name');

    res.status(201).json(newComment);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '服务器内部错误' });
  }
};