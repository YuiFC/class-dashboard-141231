<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo-area">
        <el-icon :size="24" color="#fff" style="margin-right: 8px"><Platform /></el-icon>
        <span>班级看板系统</span>
      </div>

      <el-menu
        active-text-color="#ffd04b"
        background-color="#304156"
        class="el-menu-vertical"
        default-active="/dashboard/forum"
        text-color="#fff"
        router
      >
        <el-menu-item index="/dashboard/forum">
          <el-icon><ChatDotSquare /></el-icon>
          <span>班级论坛</span>
        </el-menu-item>

        <el-menu-item index="/dashboard/events">
          <el-icon><Calendar /></el-icon>
          <span>班级日程</span>
        </el-menu-item>

        <el-menu-item index="/dashboard/chat">
          <el-icon><Cpu /></el-icon>
          <span>AI 助教</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h3>欢迎回来，{{ user?.name }} 同学</h3>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ user?.email }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="js">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter();

// 获取当前用户信息
const user = computed(() => authStore.user);

// 退出登录逻辑
const handleLogout = () => {
  authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};
</script>

<style scoped>
.layout-container {
  height: 100vh; /* 全屏高度 */
}

.aside {
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b3649;
}

.el-menu-vertical {
  border-right: none; /* 去掉菜单右边的边框 */
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
