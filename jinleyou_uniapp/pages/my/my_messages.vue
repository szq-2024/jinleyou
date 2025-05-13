<template>
  <view class="container">
    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view 
        v-for="item in chatList" 
        :key="item.userId"
        class="message-card"
        @click="enterChat(item)"
      >
        <!-- 用户信息 -->
        <view class="user-info">
          <image class="avatar" :src="item.avatar || '/static/default-avatar.png'" />
          <view class="text-info">
            <view class="top-line">
              <text class="nickname">{{ item.nickname }}</text>
              <text class="time">{{ formatTime(item.lastTime) }}</text>
            </view>
            <text class="preview">{{ item.lastContent }}</text>
          </view>
        </view>
        
        <!-- 未读标识 -->
        <view v-if="item.unread > 0" class="unread-badge">
          {{ item.unread > 99 ? '99+' : item.unread }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { http } from '@/api/http';

const chatList = ref([]);

onLoad(async () => {
  // 获取消息列表（假设接口为/chat/contacts）
  try {
    const res = await http.get('/api/chat/contacts');
    chatList.value = res.data.map(item => ({
      userId: item.userId,
      nickname: item.nickname,
      avatar: item.avatar,
      lastContent: item.lastContent,
      lastTime: item.lastTime,
      unread: item.unreadCount
    }));
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
});

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format('MM-DD HH:mm');
};

// 进入聊天页
const enterChat = (item) => {
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${item.userId}&title=${encodeURIComponent(item.nickname)}`
  });
};
</script>

<style lang="scss" scoped>
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.container {
  height: 100vh;
  background: #f8f8f8;
  
  .message-list {
    height: 100%;
    padding: 20rpx;
  }

  .message-card {
    background: white;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    position: relative;

    .user-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }

      .text-info {
        flex: 1;
        
        .top-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12rpx;

          .nickname {
            font-size: 28rpx;
            color: #333;
            max-width: 400rpx;
            @include text-ellipsis;
          }

          .time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .preview {
          font-size: 26rpx;
          color: #666;
          @include text-ellipsis;
          max-width: 500rpx;
        }
      }
    }

    .unread-badge {
      position: absolute;
      right: 24rpx;
      top: 50%;
      transform: translateY(-50%);
      background: #ff3b30;
      color: white;
      min-width: 36rpx;
      height: 36rpx;
      border-radius: 100rpx;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10rpx;
    }
  }
}
</style>