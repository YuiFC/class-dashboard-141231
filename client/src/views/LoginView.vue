<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="card-header">
          <h2>班级看板登录</h2>
        </div>
      </template>

      <el-form :model="form" label-width="0">
        <el-form-item>
          <el-input v-model="form.email" placeholder="请输入学校邮箱" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="full-width-btn" size="large" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>

        <div class="auth-links">
          <router-link to="/register">还没有账号？去注册</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  loading.value = true;
  try {
    await authStore.login(form.value);
    ElMessage.success('登录成功');
    router.push('/dashboard'); // 跳转到主页
  } catch (error) {
    ElMessage.error(error.message || '登录失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('https://picsum.photos/1920/1080?blur=2'); /* 随机背景图 */
  background-size: cover;
}

.auth-card {
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header h2 {
  text-align: center;
  margin: 0;
  color: #333;
}

.full-width-btn {
  width: 100%;
}

.auth-links {
  text-align: center;
  margin-top: 10px;
}

.auth-links a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}
</style>
