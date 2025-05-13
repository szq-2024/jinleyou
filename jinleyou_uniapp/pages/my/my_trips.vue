<template>
  <view class="partner-container">
    <!-- 内容区域 -->
    <main class="content-section">
      <empty-state 
        v-if="trips.length === 0 && !isLoading"
        description="您还没有发布过行程"
        action-text="创建行程"
        @action="navigateToCreate"
      />
      <view class="trip-list">
        <view 
          v-for="(item, index) in trips"
          :key="index"
          class="trip-card"
        >
          <text class="type-tag plan-tag">我的行程</text>
          <view class="card-content">
            <view class="card-header">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-time">
                日期：{{ dayjs(item.date).format('YY/MM/DD') }}
              </text>
            </view>
            <view class="card-meta">
              <text class="card-location">地点：{{ item.destination }}</text>
              <text class="card-preference">偏好：{{ item.preference }}</text>
            </view>
            <text class="card-desc">描述：{{ item.description }}</text>
          </view>
          <button 
            class="delete-button"
            @click="handleDelete(item.id)"
          >
            删除
          </button>
        </view>
      </view>
    </main>

    <!-- 加载状态 -->
    <loading-overlay :visible="isLoading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { http } from '@/api/http';
import EmptyState from '@/components/EmptyState.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const trips = ref([]);
const isLoading = ref(false);

// 获取用户行程
const fetchTrips = async () => {
  try {
    isLoading.value = true;
    const response = await http.get('/api/travel-plans/my');
    trips.value = response.data;
  } catch (error) {
    console.error('获取失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 删除行程
const handleDelete = async (id) => {
  try {
    await http.delete(`/api/travel-plans/${id}`);
    uni.showToast({ title: '删除成功', icon: 'success' });
    trips.value = trips.value.filter(item => item.id !== id);
  } catch (error) {
    uni.showToast({ title: '删除失败', icon: 'none' });
  }
};

// 导航到创建页
const navigateToCreate = () => {
  uni.navigateTo({
    url: '/pages/partner/create-plans'
  });
};

onMounted(fetchTrips);
</script>

<style lang="scss" scoped>
.partner-container {
  background: #f7f7f7;  /* 改为你的目标背景色 */
  min-height: 100vh;
}
.page-title {
  font-size: 36rpx;
  font-weight: 600;
  padding: 32rpx;
  display: block;
  color: white;
}

.trip-list {
  padding: 32rpx;
}

.trip-card {
  position: relative;
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.delete-button {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  background: #4cd964;
  color: white;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

/* 复用原有卡片样式 */
.card-content {
  padding-right: 160rpx;

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    margin-top: 36rpx;
    margin-bottom: 12rpx;
  }

  .card-title {
    font-size: 32rpx;
    font-weight: 500;
  }

  .card-time {
    color: #666;
    font-size: 26rpx;
  }

  .card-meta {
    display: flex;
    gap: 20rpx;
    margin: 8rpx 0;
    font-size: 26rpx;
    color: #666;
  }

  .card-desc {
    color: #888;
    font-size: 28rpx;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}

.type-tag {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  background: #e6f4ff;
  color: #1890ff;
}
</style>