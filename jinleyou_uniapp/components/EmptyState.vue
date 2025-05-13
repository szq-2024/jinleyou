<template>
  <view class="empty-container">
    <image 
      class="empty-image"
      src="/static/empty-state.png"
      mode="aspectFit"
    />
    <text class="empty-description">{{ description }}</text>
    
    <button 
      v-if="actionText"
      class="action-button"
      @click="handleAction"
    >
      {{ actionText }}
    </button>
  </view>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    required: true
  },
  actionText: String
});

const emit = defineEmits(['action']);

const handleAction = () => {
  emit('action');
};
</script>

<style lang="scss" scoped>
.empty-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 40rpx;
  opacity: 0.8;
}

.empty-description {
  font-size: 28rpx;
  color: #999;
  text-align: center;
  margin-bottom: 60rpx;
}

.action-button {
  background: #4369f4;
  color: white;
  padding: 20rpx 48rpx;
  border-radius: 48rpx;
  font-size: 28rpx;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
}
</style>