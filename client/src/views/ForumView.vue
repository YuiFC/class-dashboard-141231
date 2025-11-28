<template>
  <div class="forum-container">
    <div class="header-actions">
      <h2>班级讨论区</h2>
      <el-button type="primary" size="large" @click="dialogVisible = true">
        <el-icon style="margin-right: 5px"><Edit /></el-icon>
        发布新帖
      </el-button>
    </div>

    <el-skeleton :loading="loading" animated :count="3">
      <template #template>
        <div style="margin-bottom: 20px;">
          <el-skeleton-item variant="h3" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 80%" />
        </div>
      </template>

      <template #default>
        <el-empty v-if="posts.length === 0" description="还没人发言，快来抢沙发！" />

        <div v-else class="post-list">
          <el-card
            v-for="post in posts"
            :key="post._id"
            class="post-card"
            shadow="hover"
            @click="goToDetail(post._id)"
          >
            <div class="post-header">
              <span class="post-title">{{ post.title }}</span>
              <el-tag size="small" effect="plain">{{ formatDate(post.createdAt) }}</el-tag>
            </div>

            <div class="post-preview">
              {{ post.content }}
            </div>

            <div class="post-footer">
              <div class="author-info">
                <el-avatar :size="24" style="margin-right: 8px; background-color: #409eff">
                  {{ post.author?.name?.charAt(0) || '友' }}
                </el-avatar>
                <span class="author-name">{{ post.author?.name || '神秘同学' }}</span>
              </div>
              <el-button type="primary" link>查看详情 ></el-button>
            </div>
          </el-card>
        </div>
      </template>
    </el-skeleton>

    <el-dialog v-model="dialogVisible" title="发布新话题" width="500px">
      <el-form :model="form" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题（必填）" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="分享你的想法..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate" :loading="submitting">
            发布
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request'; // 引入我们封装的 axios
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

// --- 数据状态 ---
const posts = ref([]); // 帖子列表
const loading = ref(true); // 加载状态
const dialogVisible = ref(false); // 弹窗是否显示
const submitting = ref(false); // 提交按钮loading

// 发帖表单
const form = ref({
  title: '',
  content: ''
});

// --- 方法 ---

// 1. 获取帖子列表
const fetchPosts = async () => {
  loading.value = true;
  try {
    // 调用后端 GET /api/posts
    const res = await request.get('/posts');
    posts.value = res;
  } catch (error) {
    ElMessage.error('加载帖子失败');
  } finally {
    loading.value = false;
  }
};

// 2. 创建帖子
const handleCreate = async () => {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('标题和内容不能为空');
    return;
  }

  submitting.value = true;
  try {
    // 调用后端 POST /api/posts
    await request.post('/posts', form.value);

    ElMessage.success('发布成功！');
    dialogVisible.value = false; // 关闭弹窗
    form.value.title = '';       // 清空表单
    form.value.content = '';

    // 重新获取列表，让新帖子显示出来
    fetchPosts();
  } catch (error) {
    ElMessage.error(error.message || '发布失败');
  } finally {
    submitting.value = false;
  }
};

// 3. 跳转到详情页
const goToDetail = (id) => {
  router.push(`/dashboard/forum/${id}`);
};

// 4. 简单的日期格式化工具
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 页面加载时自动获取数据
onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.forum-container {
  max-width: 800px;
  margin: 0 auto; /* 居中显示 */
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-card {
  margin-bottom: 15px;
  cursor: pointer; /* 鼠标放上去变成小手 */
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px); /* 悬浮时轻微上浮效果 */
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.post-preview {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  /* 限制显示2行，多余的省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  font-size: 14px;
  color: #909399;
}
</style>
