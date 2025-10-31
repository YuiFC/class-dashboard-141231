// server/models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 关联到 User 模型
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // 暂时先不加评论，我们稍后会通过 Comment 模型来反向关联
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

module.exports = mongoose.model('Post', postSchema);