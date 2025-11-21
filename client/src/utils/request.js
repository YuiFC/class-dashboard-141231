// src/utils/request.js
import axios from 'axios';

// 1. 创建 axios 实例
const service = axios.create({
  // 这里的地址必须和你后端运行的地址一致
  baseURL: 'http://localhost:3001/api',
  timeout: 5000 // 请求超时时间
});

// 2. 请求拦截器 (Request Interceptor)
// 在发送请求之前做些什么
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');

    // 如果有 token，就把它加到请求头里
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 3. 响应拦截器 (Response Interceptor)
// 在收到响应之后做些什么
service.interceptors.response.use(
  response => {
    // 如果响应状态码是 2xx，直接返回数据部分
    return response.data;
  },
  error => {
    // 如果出错了（比如 401, 500）
    console.error('API Error:', error.response); // for debug

    // 如果是 401 (未授权)，说明 Token 过期或无效
    // 我们可以强制用户登出
    if (error.response && error.response.status === 401) {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       // 这里可以加一个重定向到登录页的逻辑，暂时先不加
    }

    // 把错误信息返回去，让具体的页面去处理
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default service;
