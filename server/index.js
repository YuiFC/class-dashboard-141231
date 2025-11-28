// server/index.js

// 1. 导入依赖
require('dotenv').config(); // 从 .env 文件加载环境变量
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 【新代码 1：引入 path 模块】

// 2. 初始化 Express 应用
const app = express();
const port = process.env.PORT || 3001; // 使用 .env 中定义的端口，否则默认为 3001

// 3. 设置中间件
app.use(cors()); // 启用跨域资源共享 (CORS)
app.use(express.json()); // 让服务器能解析请求体中的 JSON 数据

// 4. 连接到 MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('MongoDB 数据库连接成功。');
  })
  .catch((err) => {
    console.error('MongoDB 连接失败:', err);
  });

// 监听数据库连接错误事件
mongoose.connection.on('error', err => {
  console.error('MongoDB 运行时错误:', err);
});

// 5. 定义一个简单的测试路由
// app.get('/', (req, res) => {
//  res.send('来自班级看板后端的问候！');
// });

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const chatRouts = require('./routes/chat');
app.use('/api/chat', chatRouts);

// 【新代码 2：生产环境托管前端】
// ---------------------------------------------------------------------
// 1. 让 Express 提供 client/dist 文件夹下的静态文件服务
// __dirname 表示当前 server 文件夹的路径，../client/dist 就是前端打包的路径
app.use(express.static(path.join(__dirname, '../client/dist')));

// 2. 处理所有未被 API 捕获的请求，都返回 index.html
// 这对于 Vue Router 的 history 模式至关重要（防止刷新页面 404）
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
// ---------------------------------------------------------------------


// 6. 启动服务器
app.listen(port, () => {
  console.log(`服务器正在 http://localhost:${port} 上运行`);
});