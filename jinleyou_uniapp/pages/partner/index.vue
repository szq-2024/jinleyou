<template>
  <view class="partner-container">
    <!-- 头部区域 -->
    <header class="header-section">
      <nav class="tab-nav">
        <button 
          :class="['tab-btn', { 'active-tab': activeTab === 'plans' }]" 
          @click="activeTab = 'plans'"
        >
          🗺️ 旅行计划
        </button>
        <button 
          :class="['tab-btn', { 'active-tab': activeTab === 'guides' }]" 
          @click="activeTab = 'guides'"
        >
          🧭 导游服务
        </button>
      </nav>
    </header>

    <!-- 内容区域 -->
    <main class="content-section">
      <template v-if="activeTab === 'plans'">
        <empty-state v-if="filteredPlans.length === 0" 
          description="暂时没有找到旅行计划"
          action-text="创建计划"
          @action="navigateToCreate('plan')"
        />
        <card-list v-else :items="filteredPlans" type="plan" @item-click="startChat" />
      </template>

      <template v-else>
        <empty-state v-if="filteredGuides.length === 0"
          description="暂时没有可预约的导游"
          action-text="发布服务"
          @action="navigateToCreate('guide')"
        />
        <card-list 
          v-else 
          :items="filteredGuides" 
          type="guide" 
          @item-click="startChat"
          @chat="startChat" 
        />
      </template>
    </main>

    <!-- 悬浮操作按钮 -->
    <view class="floating-actions">
      <button class="fab-button" @click="navigateToCreate(activeTab)">
        <text class="fab-icon">{{ activeTab === 'plans' ? '✏️' : '✨' }}</text>
      </button>
    </view>

    <!-- 加载状态 -->
    <loading-overlay :visible="isLoading" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app'; // 添加页面生命周期钩子
import dayjs from 'dayjs';
import { http } from '@/api/http';

// 组件
import EmptyState from '@/components/EmptyState.vue';
import CardList from '@/components/CardList.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const activeTab = ref('plans');
const isLoading = ref(false);
const plans = ref([]);
const guides = ref([]);
const loadData = () => {
  Promise.all([fetchPlans(), fetchGuides()]);
};
// 计算属性
const filteredPlans = computed(() => {
  return plans.value.filter(plan => 
    dayjs(plan.date).isSameOrAfter(dayjs().startOf('day'))
  );
});

const filteredGuides = computed(() => guides.value);

// 方法
const navigateToCreate = (type) => {
  uni.navigateTo({
    url: `/pages/partner/create-${type}`
  });
};

const startChat = (item) => {
  // 改为检查 user_id 字段
  if (!item?.user?.id) {
      console.error('Invalid user data:', item);
      return;
    }
  
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${item.user.id}&title=${encodeURIComponent(item.title)}`
  });
};

// 数据获取
const fetchData = async (url) => {
  try {
    isLoading.value = true;
    const response = await http.get(url);
    return response.data || [];
  } catch (error) {
    console.error('数据获取失败:', error);
    return [];
  } finally {
    isLoading.value = false;
  }
};

const fetchPlans = async () => {
  plans.value = await fetchData('/api/travel-plans');
};

const fetchGuides = async () => {
  guides.value = await fetchData('/api/guide-services');
};
onShow(() => {
  loadData();
});
onMounted(() => {
  Promise.all([fetchPlans(), fetchGuides()]);
});
</script>

<style lang="scss">
.partner-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fb;
}

.header-section {
  padding: 24rpx 32rpx;
  background: linear-gradient(135deg, #4369f4 0%, #284bce 100%);
  color: white;
  border-radius: 0 0 40rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(66, 133, 244, 0.15);
}

.tab-nav {
  display: flex;
  gap: 32rpx;
  margin-top: 32rpx;
}

.tab-btn {
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.15);
  font-size: 28rpx;
  transition: all 0.3s;

  &.active-tab {
    background: white;
    color: #4369f4;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  }
}

.content-section {
  flex: 1;
  padding: 32rpx;
}

.floating-actions {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
}

.fab-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #4369f4;
  box-shadow: 0 8rpx 24rpx rgba(66, 133, 244, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab-icon {
  font-size: 48rpx;
}
</style>