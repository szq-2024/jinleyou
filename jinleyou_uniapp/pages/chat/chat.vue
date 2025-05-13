<!-- pages/chat/chat.vue -->
<template>
  <view class="container">
    <!-- 聊天内容区域 -->
    <scroll-view 
      class="chat-scroll"
      scroll-y 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scroll="handleScroll"
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="msg.id"
        class="message-wrap"
        :class="{ 'self-message': msg.senderId === currentUserId }"
      >
        <!-- 对方头像 -->
        <image 
          v-if="msg.senderId !== currentUserId"
          :src="msg.senderAvatar || '/static/default-avatar.png'"
          class="avatar"
        />
        
        <!-- 消息容器 -->
        <view class="bubble-container">
          <view class="bubble" :class="{ 'self-bubble': msg.senderId === currentUserId }">
            <text class="content">{{ msg.content }}</text>
          </view>
          <text class="time">{{ formatTime(msg.createdAt) }}</text>
        </view>
      </view>
      <view id="bottom-anchor"></view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input
        v-model="inputValue"
        class="input"
        placeholder="输入消息"
        :adjust-position="false"
        @confirm="sendMessage"
      />
      <button class="send-btn" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { http } from '@/api/http'

const currentUserId = ref(Number(uni.getStorageSync('userId')));
const currentUserAvatar = ref('')
const targetUserId = ref(null)
const messages = ref([])
const inputValue = ref('')
const scrollTop = ref(0)
const autoScroll = ref(true)
const systemInfo = ref({})

const formatTime = (time) => {
  return dayjs(time).format('HH:mm')
}

const handleScroll = (e) => {
  // 当用户手动向上滚动时，暂停自动滚动
  const { scrollHeight, scrollTop: st, deltaY } = e.detail
  autoScroll.value = st + deltaY >= scrollHeight - 500
}

const scrollToBottom = async (animate = true) => {
  if (!autoScroll.value) return
  
  await nextTick()
  const query = uni.createSelectorQuery()
  query.select('#bottom-anchor').boundingClientRect()
  query.select('.chat-scroll').boundingClientRect()
  query.exec(res => {
    if (res[0] && res[1]) {
      scrollTop.value = res[0].top - res[1].top + scrollTop.value
      // 添加防抖处理
      setTimeout(() => autoScroll.value = true, 500)
    }
  })
}

const loadMessages = async () => {
  try {
    const res = await http.get(`/api/chat/${targetUserId.value}`)
    messages.value = res.data.map(msg => ({
      ...msg,
      createdAt: msg.createdAt,
      senderAvatar: msg.senderAvatar || '/static/default-avatar.png'
    }))
    await scrollToBottom(false)
  } catch (e) {
    uni.showToast({ title: '加载消息失败', icon: 'none' })
  }
}

const sendMessage = async () => {
  if (!inputValue.value.trim()) return
  
  try {
    const res = await http.post('/api/chat', {
      receiverId: targetUserId.value,
      content: inputValue.value
    })
    
    messages.value.push({
      id: res.id,
      senderId: currentUserId.value,
      content: inputValue.value,
      createdAt: new Date().toISOString(),
      senderAvatar: currentUserAvatar.value
    })
    
    inputValue.value = ''
    await scrollToBottom()
  } catch (e) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

const markAsRead = async () => {
  try {
    await http.put(`/api/chat/${targetUserId.value}/mark-as-read`)
  } catch (e) {
    console.error('标记已读失败', e)
  }
}

onLoad(async (options) => {
  targetUserId.value = options.userId
  systemInfo.value = await uni.getSystemInfoSync()
  await loadMessages()
  markAsRead()
})

// 处理键盘高度变化
let keyboardHeight = 0
uni.onKeyboardHeightChange(res => {
  keyboardHeight = res.height
  const scrollHeight = systemInfo.value.windowHeight - (keyboardHeight ? 190 : 120)
  scrollTop.value += keyboardHeight ? -50 : 50
})
</script>

<style lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
}

.chat-scroll {
  height: calc(100vh - 120rpx); // 动态高度
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
  overflow-anchor: auto; // 启用自动锚定
}

.input-area {
  height: 100rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 999;
}

.message-wrap {
  display: flex;
  margin-bottom: 40rpx;
  align-items: flex-start;
  
  &.self-message {
    flex-direction: row-reverse;
    .bubble-container {
      align-items: flex-end;
    }
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  margin: 0 20rpx;
}

.bubble-container {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  min-height: 80rpx;
}

.bubble {
  padding: 20rpx;
  border-radius: 12rpx;
  background: #fff;
  position: relative;
  word-break: break-word;
  
  .content {
    font-size: 28rpx;
    line-height: 1.5;
    color: #333;
  }

  &.self-bubble {
    background: #007AFF;
    .content {
      color: white;
    }
  }
}

.time {
  font-size: 20rpx;
  color: #999;
  margin-top: 10rpx;
}

.input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
}

.send-btn {
  width: 140rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #007AFF;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
  transition: opacity 0.2s;
  
  &:active {
    opacity: 0.8;
  }
}
</style>