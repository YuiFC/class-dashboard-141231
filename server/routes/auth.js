// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 导入控制器

// 定义路由：
// 当有 POST 请求访问 /register 路径时，
// 调用 authController.register 这个函数来处理
router.post('/register', authController.register);

router.post('/login', authController.login);


// 别忘了导出 router
module.exports = router;