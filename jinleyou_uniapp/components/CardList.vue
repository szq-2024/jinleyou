<template>
  <view class="card-list">
    <view 
      v-for="(item, index) in items"
      :key="index"
      class="card-item"
      @click="handleClick(item)"
    >
      <!-- 修改后的旅行计划卡片 -->
      <template v-if="type === 'plan'">
        <text class="type-tag plan-tag">{{ typeMap[type] }}</text>
        <view class="card-content">
          <view class="card-header">
            <text class="card-title">标题：{{ item.title }}</text>
            <!-- 将时间元素移动到标题下方 -->
            <text class="card-time">
              日期：{{ dayjs(item.date).format('YY/MM/DD') }}
            </text>
          </view>
          <view class="card-meta">
            <text class="card-location">地点： {{ item.destination }}</text>
            <text class="card-preference">偏好：{{ item.preference }}</text>
          </view>
          <text class="card-desc">描述：{{ item.description }}</text>
        </view>
        <button class="chat-button">私聊</button>
      </template>

      <!-- 导游服务卡片 -->
  <!-- 导游服务卡片 -->
  <template v-else>
    <text class="type-tag guide-tag">{{ typeMap[type] }}</text>
    <view class="guide-header">
      <view class="guide-info">
        <text class="card-location">地点： {{ item.destination }}</text>
        <text class="guide-service">类型：{{ item.type }}</text>
        <text class="guide-price">价格：{{ item.price }}元</text>
      </view>
    </view>
    <text class="guide-desc">描述：{{ item.description }}</text>
    <button 
      v-if="showDelete"
      class="delete-button"
      @click.stop="$emit('delete', item)"
    >
      删除
    </button>
    <button
      v-else
      class="chat-button"
      @click.stop="$emit('chat', item)"
    >
      私聊
    </button>
  </template>
    </view>
  </view>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
const typeMap = {
  plan: '旅行计划',
  guide: '导游服务'
};

defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    validator: (value) => ['plan', 'guide'].includes(value)
  },
    showDelete: {
      type: Boolean,
      default: false
    }
});

const emit = defineEmits(['itemClick', 'chat']);

const handleClick = (item) => {
  emit('itemClick', item);
};
</script>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
}

.card-item {
  position: relative;
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  min-height: 240rpx;
  
  &:active {
    transform: scale(0.98);
  }
}

/* 类型标签 */
.type-tag {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  z-index: 1;

  &.plan-tag {
    background: #e6f4ff;
    color: #1890ff;
  }

  &.guide-tag {
    background: #fff7e6;
    color: #fa8c16;
  }
}
/* 新增删除按钮样式 */
.delete-button {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  background: #8A2BE2;
  color: white;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  line-height: 1.5;
}
/* 通用按钮样式 */
.chat-button {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  background: #4369f4;
  color: white;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

/* 计划卡片样式 */
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
	margin-bottom: 4rpx;
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

/* 导游卡片样式 */
.guide-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 36rpx;
  padding-right: 160rpx;

    .guide-info {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
    }

  .guide-name {
    display: block;
    font-size: 30rpx;
    font-weight: 500;
    margin-bottom: 8rpx;
  }

  .guide-location {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  .guide-service {
    color: #888;
    font-weight: 500;
    font-size: 28rpx;
  }
  
  .guide-price {
  color: #888;
  font-size: 28rpx;
}
}

.guide-desc {
  color: #888;
  font-size: 28rpx;
  line-height: 1.4;
  margin-top: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-right: 160rpx;
}
</style>