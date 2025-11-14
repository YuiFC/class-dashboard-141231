// server/controllers/eventController.js
const Event = require('../models/Event');
const User = require('../models/User'); // 我们需要 User 模型来查找所有同学的邮箱
const nodemailer = require('nodemailer');

// --- 邮件发送器配置 ---
// 在控制器顶部配置一个可重用的 "transporter"
// 它使用 .env 文件中的配置来连接到 Gmail 服务
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// -----------------------

// 1. 创建新日程（受保护）
exports.createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    // 1. 创建并保存日程
    const newEvent = new Event({
      title,
      description,
      startTime,
      endTime,
      creator: req.user.id // 来自 auth 中间件
    });
    await newEvent.save();

    // 2. --- 邮件通知逻辑 ---
    // 查找所有学生用户 (你也可以根据 'role' 字段来筛选)
    const users = await User.find({}, 'email'); // 只获取 email 字段
    const recipientEmails = users.map(user => user.email);

    if (recipientEmails.length > 0) {
      // 3. 定义邮件内容
      const mailOptions = {
        from: `"班级看板" <${process.env.EMAIL_USER}>`,
        to: recipientEmails.join(', '), // 发送给所有用逗号隔开的邮箱
        subject: `【新日程通知】: ${title}`,
        html: `
          <h1>班级有新日程啦！</h1>
          <p><strong>标题:</strong> ${title}</p>
          <p><strong>描述:</strong> ${description || '无'}</p>
          <p><strong>开始时间:</strong> ${new Date(startTime).toLocaleString('zh-CN')}</p>
          <p><strong>结束时间:</strong> ${new Date(endTime).toLocaleString('zh-CN')}</p>
          <p>请注意查看！</p>
        `
      };

      // 4. 发送邮件 (异步)
      // 我们用 .then/.catch 来处理，因为不希望邮件发送失败导致整个请求失败
      transporter.sendMail(mailOptions)
        .then(info => {
          console.log('邮件已发送: ' + info.response);
        })
        .catch(err => {
          console.error('邮件发送失败:', err);
        });
    }

    // 5. 无论邮件是否发送成功，都立即返回 201
    res.status(201).json(newEvent);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 2. 获取所有日程（公开）
exports.getAllEvents = async (req, res) => {
  try {
    // 查找所有日程，并按开始时间升序排列（最近的在前面）
    const events = await Event.find()
      .populate('creator', 'name')
      .sort({ startTime: 'asc' });
      
    res.status(200).json(events);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: '服务器内部错误' });
  }
};