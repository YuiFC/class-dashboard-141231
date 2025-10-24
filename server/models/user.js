// server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 该字段是必需的
  },
  email: {
    type: String,
    required: true,
    unique: true, // 集合中每个文档的 email 必须是唯一的
    lowercase: true, // 存储时自动转换为小写，避免大小写导致的重复
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'], // 角色只能是数组中的值之一
    default: 'student', // 如果不提供，默认为 'student'
  },
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt 两个时间戳字段
});

// 将 schema 编译成一个 model 并导出
// mongoose.model 的第一个参数 'User' 是未来在数据库中集合的名字（Mongoose 会自动转为复数 users）
module.exports = mongoose.model('User', userSchema);