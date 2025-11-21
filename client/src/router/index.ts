// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认跳转到登录
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue') // 懒加载组件
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      // 【修改开始】添加 children 属性
      children: [
        {
          path: '', // 默认子路由，访问 /dashboard 时重定向到论坛
          redirect: '/dashboard/forum'
        },
        {
          path: 'forum', // 路径是 /dashboard/forum
          name: 'forum',
          component: () => import('../views/ForumView.vue')
        },
        {
          path: 'events', // 路径是 /dashboard/events
          name: 'events',
          component: () => import('../views/EventsView.vue')
        },
        {
          path: 'chat', // 路径是 /dashboard/chat
          name: 'chat',
          component: () => import('../views/ChatView.vue')
        }
      ]
      // 【修改结束】
    }
  ]
})

// --- 路由守卫 (Navigation Guard) ---
// 每次页面跳转前，都会执行这个函数
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 1. 如果要去的地方需要登录 (requiresAuth) 且 用户没登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // 强制踢回登录页
  }
  // 2. 如果用户已经登录了，还想去访问登录或注册页
  else if (authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    next('/dashboard'); // 直接送去仪表盘
  }
  else {
    next(); // 放行
  }
})

export default router
