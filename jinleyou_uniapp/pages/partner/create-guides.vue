<template>
  <view class="form-container">
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-body">

        <!-- 服务景点 -->
        <form-field label="服务景点" required>
          <view class="field-tips">请选择天津热门文化景点</view>
          <picker 
            mode="selector" 
            :range="destinations" 
            @change="handleDestinationChange"
          >
            <view class="picker-box">
              {{ form.destination || '请选择景点' }}
            </view>
          </picker>
        </form-field>

        <!-- 服务日期 -->
        <form-field label="服务日期" required>
          <view class="field-tips">请选择可提供服务的时间</view>
          <picker mode="date" @change="handleDateChange">
            <view class="picker-box">
              {{ form.serviceDate || '请选择日期' }}
            </view>
          </picker>
        </form-field>

        <!-- 服务类型 -->
        <form-field label="服务类型" required>
          <view class="field-tips">选择您提供的主要服务形式</view>
          <picker
            mode="selector"
            :range="serviceTypeOptions"
            @change="handleTypeChange"
          >
            <view class="picker-box">
              {{ form.type || '请选择服务类型' }}
            </view>
          </picker>
        </form-field>

        <!-- 服务时长 -->
        <form-field label="服务时长" required>
          <view class="field-tips">请选择服务时长（1-8小时）</view>
          <picker
            mode="selector"
            :range="durationOptions"
            @change="handleDurationChange"
          >
            <view class="picker-box">
              {{ form.duration ? `${form.duration}小时` : '请选择时长' }}
            </view>
          </picker>
        </form-field>

        <!-- 服务价格 -->
        <form-field label="服务价格" required>
          <view class="field-tips">请输入合理的收费标准（元/天）</view>
          <input
            v-model.number="form.price"
            type="number"
            class="form-input"
            placeholder="例如：500"
          />
        </form-field>

        <!-- 服务描述 -->
        <form-field label="服务描述" required>
          <view class="field-tips">包含服务内容、注意事项等重要信息</view>
          <textarea
            v-model="form.description"
            class="form-textarea"
            placeholder="详细描述您的服务内容..."
            auto-height
          />
        </form-field>
      </view>
    </scroll-view>

    <view class="form-footer">
      <button class="submit-button" @click="submitForm">立即发布</button>
    </view>

    <loading-overlay :visible="isSubmitting" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { http } from '@/api/http';

const form = ref({
  destination: '',
  serviceDate: '',
  type: '',
  duration: null,
  price: null,
  description: ''
});

const isSubmitting = ref(false);
const destinations = ref([
    '天津之眼',
	'五大道', 
	'古文化街',
    '意式风情街',
    '海河游船',
    '瓷房子',
	'天津博物馆',
	'盘山'
]);
const serviceTypeOptions = ['历史讲解', '美食导览', '城市观光', '户外探险'];
const durationOptions = Array.from({length: 8}, (_, i) => i + 1);

const validateForm = () => {
  const requiredFields = [
    { key: 'destination', message: '请选择服务景点' },
    { key: 'serviceDate', message: '请选择服务日期' },
    { key: 'type', message: '请选择服务类型' },
    { key: 'duration', message: '请选择服务时长' },
    { key: 'price', message: '请填写服务价格' },
    { key: 'description', message: '请填写服务描述' }
  ];

  for (const field of requiredFields) {
    if (!form.value[field.key]) {
      uni.showToast({ title: field.message, icon: 'none' });
      return false;
    }
  }

  if (form.value.price < 0) {
    uni.showToast({ title: '价格需大于0元', icon: 'none' });
    return false;
  }
  
  return true;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;
    await http.post('/api/guide-services', form.value);
    uni.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
          uni.navigateBack({
            success() {
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 1];
              if (prevPage.$vm?.handleRefresh) {
                prevPage.$vm.handleRefresh();
              }
            }
          });
        }, 1500);
  } catch (error) {
    console.error('提交失败:', error);
    uni.showToast({
      title: `发布失败: ${error.message || '未知错误'}`,
      icon: 'none',
      duration: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};

// 事件处理
const handleDestinationChange = (e) => {
  const index = e.detail.value;
  form.value.destination = destinations.value[index];
};

const handleDateChange = (e) => {
  form.value.serviceDate = e.detail.value;
};

const handleTypeChange = (e) => {
  const index = e.detail.value;
  form.value.type = serviceTypeOptions[index];
};

const handleDurationChange = (e) => {
  const index = e.detail.value;
  form.value.duration = durationOptions[index];
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