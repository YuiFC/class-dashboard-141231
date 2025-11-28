<template>
  <div class="chat-container">
    <div class="chat-layout">
      <div class="chat-header">
        <h2>🤖 班级 AI 助教</h2>
        <span class="status-badge">在线</span>
      </div>

      <div class="chat-window" ref="chatWindowRef">

        <div class="message-item ai">
          <div class="avatar">
            <el-avatar :size="40" icon="Cpu" style="background-color: #7d40e7" />
          </div>
          <div class="bubble">
            你好同学！我是你的 AI 助教。
            <br>
            无论是课程问题、作业困惑，还是生活琐事，都可以问我哦！
          </div>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-item"
          :class="msg.role"
        >
          <div class="avatar">
            <el-avatar v-if="msg.role === 'ai'" :size="40" icon="Cpu" style="background-color: #7d40e7" />
            <el-avatar v-else :size="40" icon="User" style="background-color: #409eff" />
          </div>

          <div class="bubble">
            <div style="white-space: pre-wrap;">{{ msg.content }}</div>
          </div>
        </div>

        <div v-if="loading" class="message-item ai">
          <div class="avatar">
            <el-avatar :size="40" icon="Cpu" style="background-color: #7d40e7" />
          </div>
          <div class="bubble typing">
            正在思考...
          </div>
        </div>
      </div>

      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="输入你的问题，按 Ctrl+Enter 发送..."
          resize="none"
          @keydown.ctrl.enter="sendMessage"
        />
        <div class="send-btn-wrapper">
          <el-button type="primary" @click="sendMessage" :loading="loading">
            发送 <el-icon class="el-icon--right"><Promotion /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

// --- 状态数据 ---
const messages = ref([]); // 聊天记录列表
const inputMessage = ref(''); // 输入框内容
const loading = ref(false); // 是否正在等待 AI 回复
const chatWindowRef = ref(null); // 用于操作 DOM 元素

// --- 核心方法 ---

// 1. 发送消息
const sendMessage = async () => {
  // 校验非空
  if (!inputMessage.value.trim()) return;
  if (loading.value) return; // 防止重复点击

  const content = inputMessage.value.trim();

  // 1. 立即将用户的消息显示在界面上
  messages.value.push({
    role: 'user',
    content: content
  });

  // 清空输入框并滚动到底部
  inputMessage.value = '';
  scrollToBottom();

  // 2. 发送请求给后端
  loading.value = true;
  try {
    const res = await request.post('/chat', { message: content });

    // 3. 将 AI 的回复显示在界面上
    messages.value.push({
      role: 'ai',
      content: res.reply
    });

    scrollToBottom();
  } catch (error) {
    ElMessage.error('AI 暂时开了小差，请稍后再试');
    // 可以移除刚才那条用户消息，或者显示一个红色感叹号（这里简化处理）
  } finally {
    loading.value = false;
  }
};

// 2. 自动滚动到底部
const scrollToBottom = () => {
  // nextTick 确保 DOM 更新后再执行滚动
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight;
    }
  });
};
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 120px); /* 减去顶部导航的高度，铺满剩余空间 */
  display: flex;
  justify-content: center;
}

.chat-layout {
  width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止圆角溢出 */
}

.chat-header {
  height: 60px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.status-badge {
  font-size: 12px;
  color: #67c23a;
  background: #e1f3d8;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 核心聊天窗口 */
.chat-window {
  flex: 1; /* 占据剩余所有高度 */
  padding: 20px;
  overflow-y: auto; /* 允许垂直滚动 */
  background-color: #fff;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
}

/* AI 消息样式 */
.message-item.ai {
  flex-direction: row;
}

/* 用户消息样式 (右对齐) */
.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  margin: 0 10px;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  position: relative;
  word-break: break-word; /* 防止长单词撑破布局 */
}

.ai .bubble {
  background-color: #f4f4f5;
  color: #303133;
  border-top-left-radius: 0;
}

.user .bubble {
  background-color: #ecf5ff; /* 浅蓝色 */
  color: #303133;
  border-top-right-radius: 0;
}

/* 打字动画 */
.typing {
  font-style: italic;
  color: #909399;
}

/* 底部输入区 */
.input-area {
  border-top: 1px solid #e4e7ed;
  padding: 20px;
  background-color: #fff;
}

.send-btn-wrapper {
  margin-top: 10px;
  text-align: right;
}
</style>
