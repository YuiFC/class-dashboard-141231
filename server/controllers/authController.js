// server/controllers/authController.js
const User = require('../models/User'); // 导入User模型
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    // 1. 从请求体中获取 name, email, password
    const { name, email, password } = req.body;

    // 2. 检查用户是否已存在
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // 400 Bad Request
      return res.status(400).json({ message: '此邮箱已被注册' });
    }

    // 3. 对密码进行哈希加密
    const salt = await bcrypt.genSalt(10); // 生成“盐”，增加复杂度
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. 创建新用户
    const newUser = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      // role 字段会自动使用模型中定义的 'student' 默认值
    });

    // 5. 保存到数据库
    const savedUser = await newUser.save();

    // 6. 响应客户端
    // 201 Created，表示资源创建成功
    // 我们不会把密码发回去，只发安全的信息
    res.status(201).json({
      message: '用户注册成功',
      userId: savedUser._id,
      email: savedUser.email,
    });

  } catch (error) {
    console.error('注册失败:', error);
    // 500 Internal Server Error
    res.status(500).json({ message: '服务器内部错误' });
  }
};