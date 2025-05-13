<template>
  <view class="form-container">
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-body">
        <!-- 计划标题 -->
        <form-field label="计划标题" required>
          <view class="field-tips">为您的旅行计划起一个吸引人的名称</view>
          <input 
            v-model="form.title"
            placeholder="例如：周末古文化街摄影之旅"
            class="form-input"
          />
        </form-field>

        <!-- 出发日期 -->
        <form-field label="出发日期" required>
          <view class="field-tips">请选择旅行开始的具体日期</view>
          <picker mode="date" @change="onDateChange">
            <view class="picker-box">
              {{ form.date || '请选择日期' }}
            </view>
          </picker>
        </form-field>

        <!-- 目的地 -->
        <form-field label="目的地" required>
          <view class="field-tips">天津热门文化地标选择</view>
          <picker mode="selector" :range="tianjinPlaces" @change="onDestinationChange">
            <view class="picker-box">
              {{ form.destination || '请选择目的地' }}
            </view>
          </picker>
        </form-field>

        <!-- 旅行偏好 -->
        <form-field label="旅行偏好" required>
          <view class="field-tips">选择最符合本次旅行的主题类型</view>
          <picker mode="selector" :range="preferenceOptions" @change="onPreferenceChange">
            <view class="picker-box">
              {{ form.preference || '请选择偏好' }}
            </view>
          </picker>
        </form-field>

        <!-- 计划描述 -->
        <form-field label="计划描述" required>
          <view class="field-tips">包含行程安排、注意事项等重要信息</view>
          <textarea
            v-model="form.description"
            placeholder="请描述你的旅行计划（行程安排、注意事项等）"
            class="form-textarea"
            auto-height
          />
        </form-field>
      </view>
    </scroll-view>

    <view class="form-footer">
      <button class="submit-button" @click="submitForm">立即发布</button>
    </view>

    <loading-overlay :visible="isLoading" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { http } from '@/api/http';

const form = ref({
  title: '',
  date: '',
  destination: '',
  preference: '',
  description: ''
});

const isLoading = ref(false);
const tianjinPlaces = ['五大道', '意式风情街', '天津之眼', '古文化街'];
const preferenceOptions = ['美食', '历史', '自然', '摄影', '亲子'];

const onDateChange = (e) => {
  form.value.date = e.detail.value;
};

const onDestinationChange = (e) => {
  form.value.destination = tianjinPlaces[e.detail.value];
};

const onPreferenceChange = (e) => {
  form.value.preference = preferenceOptions[e.detail.value];
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    await http.post('/api/travel-plans', form.value);
    uni.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => uni.navigateBack(), 1500);
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

const validateForm = () => {
  const fields = [
    { key: 'title', message: '请填写计划标题' },
    { key: 'date', message: '请选择出发日期' },
    { key: 'destination', message: '请选择目的地' },
    { key: 'preference', message: '请选择旅行偏好' },
    { key: 'description', message: '请填写计划描述' }
  ];

  for (const field of fields) {
    if (!form.value[field.key]) {
      uni.showToast({ title: field.message, icon: 'none' });
      return false;
    }
  }
  return true;
};

const handleError = (error) => {
  console.error('提交失败:', error);
  uni.showToast({
    title: `发布失败: ${error.message || '未知错误'}`,
    icon: 'none',
    duration: 3000
  });
};
</script>

<style lang="scss" scoped>
.form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.form-scroll {
  flex: 1;
}

.form-body {
  padding: 32rpx 32rpx 120rpx;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.submit-button {
  background: linear-gradient(135deg, #4369f4, #304ffe);
  color: white;
  border-radius: 48rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 16rpx rgba(67, 105, 244, 0.3);
}

.field-tips {
  font-size: 26rpx;
  color: #94a3b8;
  margin: 12rpx 0 20rpx;
  line-height: 1.4;
}

.picker-box {
  padding: 28rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 12rpx;
  color: #334155;
  font-size: 30rpx;
  transition: all 0.2s;
  
  &:active {
    background-color: #f1f5f9;
  }
  
  &::after {
    content: '›';
    transform: rotate(90deg) translateY(-50%);
    right: 28rpx;
    font-size: 36rpx;
  }
}

.form-input,
.form-textarea {
  padding: 28rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #1e293b;
  
  &::placeholder {
    color: #cbd5e1;
  }
}

.form-textarea {
  min-height: 240rpx;
  line-height: 1.6;
}
</style>