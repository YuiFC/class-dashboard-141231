// server/models/Comment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post', // 关联到 Post 模型
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);