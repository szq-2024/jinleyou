<template>
  <view class="card-list">
    <view 
      v-for="(item, index) in items"
      :key="index"
      class="card-item"
      @click="handleClick(item)"
    >
      <!-- 旅行计划卡片 -->
      <template v-if="type === 'plan'">
        <text class="type-tag plan-tag">{{ typeMap[type] }}</text>
        <view class="card-content">
          <view class="card-header">
            <text class="card-title">标题：{{ item.title }}</text>
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

      <!-- 修改后的导游服务卡片 -->
      <template v-if="type === 'guide'">
        <text class="type-tag guide-tag">{{ typeMap[type] }}</text>
        <view class="guide-header">
          <view class="guide-info">
            <text class="guide-date">日期：{{ dayjs(item.serviceDate).format('YYYY-MM-DD') }}</text>
            <text class="card-location">景点：{{ item.destination }}</text>
            <view class="service-meta">
              <text class="guide-service">类型：{{ item.type }}</text>
              <text class="guide-duration">时长：{{ item.duration }}小时</text>
            </view>
          </view>
        </view>
        <text class="guide-price">{{ item.price }}元/天</text>
        <text class="guide-desc">服务描述：{{ item.description }}</text>
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

      <!-- 用户评论卡片 -->
      <template v-if="type === 'review'">
        <view class="review-header">
            <image :src="item.avatar" class="avatar" />
            <view class="user-info-container">
              <view class="user-info">
                <text class="nickname">{{ item.nickname }}</text>
              </view>
            </view>
            <button 
              v-if="showDelete"
              class="delete-button"
              @click.stop="$emit('delete', item)"
            >
              删除
            </button>
        </view>
        <view class="review-content">
          <text class="scenic-name line-clamp-1">景点：{{ item.scenicName }}</text>
          <text class="content-text line-clamp-1">评论内容：{{ item.content }}</text>
          <view class="image-preview" v-if="item.images && item.images.length">
              <image 
                  v-for="(img, idx) in item.images"
                  :key="idx"
                  :src="img"
                  mode="aspectFill"
                  class="review-image"
              />
          </view>
          <text class="review-time">
            {{ dayjs(item.createdAt).format('YYYY-MM-DD') }}
          </text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
const typeMap = {
  plan: '旅行计划',
  guide: '导游服务',
  review:'用户评论'
};

defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    validator: (value) => ['plans', 'guides', 'review'].includes(value)
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

/* 导游卡片优化样式 */
.guide-header {
  margin-top: 40rpx;
  padding-right: 180rpx;

  .guide-info {
    .guide-date {
      display: block;
      margin-bottom: 8rpx;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
    
    .card-location {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 8rpx;
    }

    .service-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx 20rpx;
      margin: 8rpx 0;

      .guide-service,
      .guide-duration {
        font-size: 28rpx;
        color: #666;
        white-space: normal;
      }
    }
  }
}

.guide-price {
  position: absolute;
  right: 32rpx;
  top: 80rpx;
  font-size: 28rpx;
  color: #ff4444;
  font-weight: 600;
}

.guide-desc {
  color: #666;
  font-size: 28rpx;
  line-height: 1.4;
  margin-top: 10rpx;
  padding-right: 160rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* 用户评论样式保持不变 */
.review-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .nickname {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    white-space: normal;
  }
}

.review-content {
  .scenic-name {
    color: #666;
    font-size: 26rpx;
    line-height: 1.4;
    white-space: normal;
    word-break: break-all;
  }
  .content-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  .image-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 20rpx;
  
    .review-image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 8rpx;
    }
  }
  .review-time {
    color: #999;
    font-size: 24rpx;
    margin-top: 16rpx;
    display: block;
  }
}

/* 旅行计划卡片样式 */
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
</style>