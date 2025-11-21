// src/stores/auth.js
import { defineStore } from 'pinia';
import request from '../utils/request'; // 导入我们之前封装的 axios

export const useAuthStore = defineStore('auth', {
  // 1. State: 相当于组件中的 data，用来存储全局数据
  state: () => ({
    token: localStorage.getItem('token') || '', // 优先从本地存储读取
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  // 2. Getters: 相当于组件中的 computed，计算属性
  getters: {
    isAuthenticated: (state) => !!state.token, // 转为布尔值，判断是否登录
  },

  // 3. Actions: 相当于组件中的 methods，用来处理业务逻辑
  actions: {
    // 登录动作
    async login(loginData) {
      try {
        // 发送请求给后端 POST /api/auth/login
        const res = await request.post('/auth/login', loginData);

        // 登录成功，保存数据
        this.token = res.token;
        this.user = res.user;

        // 持久化到 localStorage，防止刷新丢失
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        return true; // 返回成功
      } catch (error) {
        throw error; // 抛出错误让组件处理（比如显示报错弹窗）
      }
    },

    // 注册动作
    async register(registerData) {
      try {
        await request.post('/auth/register', registerData);
        // 注册成功后通常需要用户再去登录一次，或者自动登录
        // 这里我们简单处理，注册成功仅返回
      } catch (error) {
        throw error;
      }
    },

    // 登出动作
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 可以在这里强制跳转回登录页，也可以在组件里做
    }
  }
});
