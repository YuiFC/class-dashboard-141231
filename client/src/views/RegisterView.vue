<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="card-header">
          <h2>注册新账号</h2>
        </div>
      </template>

      <el-form :model="form" label-width="0">
        <el-form-item>
          <el-input v-model="form.name" placeholder="请输入姓名（实名方便老师辨认）" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.email" placeholder="请输入学校邮箱" size="large">
            <template #prefix><el-icon><Message /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="设置密码"
            size="large"
            show-password
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="full-width-btn" size="large" @click="handleRegister" :loading="loading">
            注册
          </el-button>
        </el-form-item>

        <div class="auth-links">
          <router-link to="/login">已有账号？去登录</router-link>
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
  name: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  loading.value = true;
  try {
    await authStore.register(form.value);
    ElMessage.success('注册成功，请登录');
    router.push('/login'); // 注册成功跳转去登录
  } catch (error) {
    ElMessage.error(error.message || '注册失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 复用之前的样式，或者为了简单，你也复制一份 LoginView 的样式到这里 */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('https://picsum.photos/1920/1080?blur=2');
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
