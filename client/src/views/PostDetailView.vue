<template>
  <div class="detail-container">
    <el-page-header @back="goBack" content="帖子详情" class="page-header" />

    <div v-if="loading" style="padding: 20px;">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="post" class="content-wrapper">
      <el-card class="post-card" shadow="never">
        <template #header>
          <div class="post-header">
            <h1 class="title">{{ post.title }}</h1>
            <div class="meta-info">
              <el-tag size="small">{{ post.author?.name || '匿名' }}</el-tag>
              <span class="time">{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
        </template>

        <div class="post-body">
          {{ post.content }}
        </div>
      </el-card>

      <div class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>

        <div v-if="comments.length > 0" class="comment-list">
          <div v-for="(comment, index) in comments" :key="comment._id" class="comment-item">
            <div class="comment-avatar">
              <el-avatar :size="32" style="background-color: #67c23a">
                {{ comment.author?.name?.charAt(0) || '评' }}
              </el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-author">
                <span class="name">{{ comment.author?.name || '匿名' }}</span>
                <span class="floor">{{ index + 1 }}楼</span>
              </div>
              <p class="text">{{ comment.content }}</p>
              <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
            </div>
          </div>
        </div>

        <el-empty v-else description="还没有人评论，快来抢沙发！" :image-size="100" />

        <div class="comment-input-area">
          <el-input
            v-model="newCommentContent"
            type="textarea"
            :rows="3"
            placeholder="写下你的看法..."
            resize="none"
          />
          <div style="margin-top: 10px; text-align: right;">
            <el-button type="primary" @click="submitComment" :loading="submitting">
              发表评论
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="帖子不存在或已被删除" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

// 获取 URL 中的 ID 参数
const postId = route.params.id;

// 数据状态
const loading = ref(true);
const submitting = ref(false);
const post = ref(null);
const comments = ref([]);
const newCommentContent = ref('');

// --- 方法 ---

// 1. 获取详情数据
const fetchDetail = async () => {
  loading.value = true;
  try {
    // 后端接口返回的是 { post: {...}, comments: [...] }
    const res = await request.get(`/posts/${postId}`);
    post.value = res.post;
    comments.value = res.comments;
  } catch (error) {
    ElMessage.error('获取帖子详情失败');
  } finally {
    loading.value = false;
  }
};

// 2. 提交评论
const submitComment = async () => {
  if (!newCommentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空');
    return;
  }

  submitting.value = true;
  try {
    // 调用后端 POST /api/posts/:id/comments
    await request.post(`/posts/${postId}/comments`, {
      content: newCommentContent.value
    });

    ElMessage.success('评论成功');
    newCommentContent.value = ''; // 清空输入框

    // 重新获取数据，让新评论显示出来
    fetchDetail();
  } catch (error) {
    ElMessage.error(error.message || '评论失败');
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 日期格式化
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// 初始化
onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.content-wrapper {
  background: #fff;
  border-radius: 4px;
  overflow: hidden; /* 防止圆角溢出 */
}

.post-card {
  border: none; /* 去掉卡片默认边框，我们要自己控制整体 */
}

.post-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.title {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #303133;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time {
  font-size: 13px;
  color: #909399;
}

.post-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  padding: 10px 0;
  white-space: pre-wrap; /* 保留换行符 */
}

/* 评论区样式 */
.comments-section {
  padding: 20px;
  background-color: #f9fafc;
  border-top: 1px solid #ebeef5;
}

.comment-list {
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  margin-left: 15px;
  flex: 1;
}

.comment-author {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-author .name {
  font-weight: bold;
  font-size: 14px;
  color: #606266;
}

.comment-author .floor {
  font-size: 12px;
  color: #c0c4cc;
}

.comment-item .text {
  margin: 5px 0;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-input-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
</style>
