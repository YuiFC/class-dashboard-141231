<template>
  <div class="events-container">
    <div class="header-actions">
      <h2>📅 班级日程表</h2>
      <el-button type="primary" size="large" @click="dialogVisible = true">
        <el-icon style="margin-right: 5px"><Plus /></el-icon>
        添加日程
      </el-button>
    </div>

    <el-skeleton :loading="loading" animated :rows="5">
      <template #default>
        <el-empty v-if="events.length === 0" description="暂无日程，享受自由时光吧！" />

        <div v-else class="timeline-wrapper">
          <el-timeline>
            <el-timeline-item
              v-for="event in events"
              :key="event._id"
              :timestamp="formatDate(event.startTime)"
              placement="top"
              :type="getEventType(event.startTime)"
              :hollow="isPast(event.startTime)"
              size="large"
            >
              <el-card class="event-card" :class="{ 'past-event': isPast(event.startTime) }">
                <div class="event-header">
                  <h3 class="event-title">{{ event.title }}</h3>
                  <el-tag :type="isPast(event.startTime) ? 'info' : 'success'">
                    {{ isPast(event.startTime) ? '已结束' : '即将开始' }}
                  </el-tag>
                </div>

                <div class="event-content">
                  <p class="description">{{ event.description || '无详细描述' }}</p>
                  <div class="time-range">
                    <el-icon><Clock /></el-icon>
                    <span>
                      {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
                    </span>
                    <span class="duration">({{ getDuration(event.startTime, event.endTime) }})</span>
                  </div>
                  <div class="creator">
                    发布者: {{ event.creator?.name || '管理员' }}
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </template>
    </el-skeleton>

    <el-dialog v-model="dialogVisible" title="📅 发布新日程" width="500px">
      <el-alert
        title="注意：发布后系统将自动向全班同学发送邮件通知，请勿发布测试垃圾信息。"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px;"
        show-icon
      />

      <el-form :model="form" label-position="top">
        <el-form-item label="日程标题">
          <el-input v-model="form.title" placeholder="例如：期末微积分考试" />
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="详细描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="例如：地点在教三-201，请带好计算器"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate" :loading="submitting">
            发布并通知全班
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const loading = ref(true);
const events = ref([]);
const dialogVisible = ref(false);
const submitting = ref(false);

const form = ref({
  title: '',
  description: '',
  dateRange: [] // [StartTime, EndTime]
});

// 1. 获取日程列表
const fetchEvents = async () => {
  loading.value = true;
  try {
    const res = await request.get('/events');
    events.value = res;
  } catch (error) {
    ElMessage.error('获取日程失败');
  } finally {
    loading.value = false;
  }
};

// 2. 创建日程
const handleCreate = async () => {
  // 校验
  if (!form.value.title || !form.value.dateRange || form.value.dateRange.length < 2) {
    ElMessage.warning('请填写标题和完整的时间范围');
    return;
  }

  submitting.value = true;
  try {
    // 构造后端需要的数据格式
    const payload = {
      title: form.value.title,
      description: form.value.description,
      startTime: form.value.dateRange[0], // 数组第一个是开始时间
      endTime: form.value.dateRange[1]    // 数组第二个是结束时间
    };

    await request.post('/events', payload);

    ElMessage.success('日程发布成功，邮件发送中...');
    dialogVisible.value = false;

    // 重置表单
    form.value.title = '';
    form.value.description = '';
    form.value.dateRange = [];

    // 刷新列表
    fetchEvents();

  } catch (error) {
    ElMessage.error(error.message || '发布失败');
  } finally {
    submitting.value = false;
  }
};

// --- 工具函数 ---

// 判断是否是过去的时间
const isPast = (isoTime) => {
  return new Date(isoTime) < new Date();
};

// 根据时间决定时间轴节点的颜色
const getEventType = (isoTime) => {
  return isPast(isoTime) ? 'info' : 'primary';
};

// 格式化日期 (YYYY年MM月DD日)
const formatDate = (isoTime) => {
  const date = new Date(isoTime);
  return date.toLocaleDateString('zh-CN', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 格式化具体时间 (HH:mm)
const formatTime = (isoTime) => {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// 计算持续时间 (例如: 2小时)
const getDuration = (start, end) => {
  const diff = new Date(end) - new Date(start); // 毫秒差
  const hours = (diff / (1000 * 60 * 60)).toFixed(1);
  return `${hours} 小时`;
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.events-container {
  max-width: 800px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.timeline-wrapper {
  padding: 0 10px;
}

.event-card {
  transition: all 0.3s;
  border-left: 5px solid #409eff; /* 左侧彩条 */
}

/* 过去事件的样式：变灰，降低透明度 */
.past-event {
  filter: grayscale(1);
  opacity: 0.7;
  border-left-color: #909399;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.event-title {
  margin: 0;
  font-size: 18px;
}

.event-content {
  color: #606266;
}

.description {
  margin-bottom: 10px;
  font-size: 14px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #303133;
}

.duration {
  font-weight: normal;
  color: #909399;
  font-size: 13px;
}

.creator {
  margin-top: 10px;
  font-size: 12px;
  color: #c0c4cc;
  text-align: right;
}
</style>
