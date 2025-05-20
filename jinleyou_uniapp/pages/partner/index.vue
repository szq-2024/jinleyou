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
      <!-- 筛选面板 -->
      <view class="filter-section">
        <view 
          class="filter-header"
          @click="toggleFilterCollapse"
        >
          <text>🔍 筛选条件</text>
          <text>{{ isCollapsed ? '展开' : '收起' }}</text>
        </view>
        
        <view v-if="!isCollapsed" class="filter-content">
          <template v-if="activeTab === 'plans'">
            <view class="filter-group">
              <picker 
                mode="date" 
                :value="filterDateRange[0]" 
                @change="handleDateStart"
                class="filter-input"
              >
                <text>{{ filterDateRange[0] || '开始日期' }}</text>
              </picker>
              <text class="date-separator">至</text>
              <picker 
                mode="date" 
                :value="filterDateRange[1]" 
                @change="handleDateEnd"
                class="filter-input"
              >
                <text>{{ filterDateRange[1] || '结束日期' }}</text>
              </picker>
            </view>

            <input 
              v-model="filterLocation" 
              placeholder="输入地点" 
              class="filter-input"
            />

            <view class="preference-filter">
              <checkbox-group @change="handlePreferenceChange">
                <label 
                  v-for="pref in validPreferences" 
                  :key="pref" 
                  class="preference-tag"
                >
                  <checkbox :value="pref" :checked="filterPreferences.includes(pref)" />
                  {{ pref }}
                </label>
              </checkbox-group>
            </view>
          </template>

          <template v-else>
            <view class="filter-group">
              <picker 
                mode="date" 
                :value="filterGuideDateRange[0]" 
                @change="handleGuideDateStart"
                class="filter-input"
              >
                <text>{{ filterGuideDateRange[0] || '开始日期' }}</text>
              </picker>
              <text class="date-separator">至</text>
              <picker 
                mode="date" 
                :value="filterGuideDateRange[1]" 
                @change="handleGuideDateEnd"
                class="filter-input"
              >
                <text>{{ filterGuideDateRange[1] || '结束日期' }}</text>
              </picker>
            </view>

            <input 
              v-model="filterDestination" 
              placeholder="输入目的地" 
              class="filter-input"
            />

            <view class="preference-filter">
              <checkbox-group @change="handleServiceTypeChange">
                <label 
                  v-for="type in validServiceTypes" 
                  :key="type" 
                  class="preference-tag"
                >
                  <checkbox :value="type" :checked="filterServiceTypes.includes(type)" />
                  {{ type }}
                </label>
              </checkbox-group>
            </view>
          </template>

          <view class="filter-actions">
            <button class="reset-btn" @click="resetFilters">重置</button>
            <button class="confirm-btn" @click="loadData">查询</button>
          </view>
        </view>
      </view>

      <!-- 内容列表 -->
      <template v-if="activeTab === 'plans'">
        <empty-state 
          v-if="filteredPlans.length === 0" 
          description="暂时没有找到旅行计划"
          action-text="创建计划"
          @action="navigateToCreate('plan')"
        />
        <card-list 
          v-else 
          :items="filteredPlans" 
          type="plan" 
          @item-click="startChat"
        />
      </template>

      <template v-else>
        <empty-state 
          v-if="filteredGuides.length === 0"
          description="暂时没有可预约的导游"
          action-text="发布服务"
          @action="navigateToCreate('guide')"
        />
        <card-list 
          v-else 
          :items="filteredGuides" 
          type="guide" 
          @item-click="startChat"
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
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { http } from '@/api/http';

// 组件
import EmptyState from '@/components/EmptyState.vue';
import CardList from '@/components/CardList.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

// 响应式状态
const activeTab = ref('plans');
const isLoading = ref(false);
const isCollapsed = ref(false);
const plans = ref([]);
const guides = ref([]);

// 筛选条件
const filterDateRange = ref([]);
const filterLocation = ref('');
const filterPreferences = ref([]);
const validPreferences = ['美食', '历史', '自然', '摄影', '亲子'];

const filterGuideDateRange = ref([]);
const filterDestination = ref('');
const filterServiceTypes = ref([]);
const validServiceTypes = ['历史讲解', '户外探险', '城市观光', '美食文化'];

// 计算属性
const filteredPlans = computed(() => {
  return plans.value.filter(plan => 
    dayjs(plan.date).isSameOrAfter(dayjs().startOf('day')) &&
    (filterLocation.value ? plan.destination.includes(filterLocation.value) : true) &&
    (filterDateRange.value.length === 2 
      ? dayjs(plan.date).isBetween(filterDateRange.value[0], filterDateRange.value[1]) 
      : true) &&
    (filterPreferences.value.length > 0 
      ? filterPreferences.value.includes(plan.preference) 
      : true)
  );
});

const filteredGuides = computed(() => {
  return guides.value.filter(guide => 
    dayjs(guide.serviceDate).isSameOrAfter(dayjs().startOf('day')) &&
    (filterDestination.value ? guide.destination.includes(filterDestination.value) : true) &&
    (filterGuideDateRange.value.length === 2 
      ? dayjs(guide.serviceDate).isBetween(filterGuideDateRange.value[0], filterGuideDateRange.value[1]) 
      : true) &&
    (filterServiceTypes.value.length > 0 
      ? filterServiceTypes.value.includes(guide.type) 
      : true)
  );
});

// 方法
const toggleFilterCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const resetFilters = () => {
  if (activeTab.value === 'plans') {
    filterDateRange.value = [];
    filterLocation.value = '';
    filterPreferences.value = [];
  } else {
    filterGuideDateRange.value = [];
    filterDestination.value = '';
    filterServiceTypes.value = [];
  }
  nextTick(() => {
    loadData();
  });
};

const navigateToCreate = (type) => {
  uni.navigateTo({
    url: `/pages/partner/create-${type}`
  });
};

const startChat = (item) => {
  const userId = item.user_id || item.user?.id;
  if (!userId) {
    console.error('Invalid user data:', item);
    return;
  }
  uni.navigateTo({
    url: `/pages/chat/chat?userId=${userId}&title=${encodeURIComponent(item.title)}`
  });
};

// 筛选处理
const handleDateStart = (e) => {
  filterDateRange.value[0] = e.detail.value;
};

const handleDateEnd = (e) => {
  filterDateRange.value[1] = e.detail.value;
};

const handleGuideDateStart = (e) => {
  filterGuideDateRange.value[0] = e.detail.value;
};

const handleGuideDateEnd = (e) => {
  filterGuideDateRange.value[1] = e.detail.value;
};

const handlePreferenceChange = (e) => {
  filterPreferences.value = e.detail.value;
};

const handleServiceTypeChange = (e) => {
  filterServiceTypes.value = e.detail.value;
};

// 数据获取
const fetchPlans = async () => {
  try {
    isLoading.value = true;
    const params = {
      dateStart: filterDateRange.value[0],
      dateEnd: filterDateRange.value[1],
      location: filterLocation.value,
      preferences: filterPreferences.value.join(',')
    };
    const response = await http.get('/api/travel-plans', { params });
    plans.value = response.data || [];
  } catch (error) {
    console.error('获取旅行计划失败:', error);
    plans.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchGuides = async () => {
  try {
    isLoading.value = true;
    const params = {
      dateStart: filterGuideDateRange.value[0],
      dateEnd: filterGuideDateRange.value[1],
      destination: filterDestination.value,
      type: filterServiceTypes.value.join(',')
    };
    const response = await http.get('/api/guide-services', { params });
    guides.value = response.data || [];
  } catch (error) {
    console.error('获取导游服务失败:', error);
    guides.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadData = () => {
  if (activeTab.value === 'plans') {
    fetchPlans();
  } else {
    fetchGuides();
  }
};

// 生命周期
watch(activeTab, (newVal) => {
  isCollapsed.value = false;
  resetFilters();
});

onShow(() => {
  loadData();
});

onMounted(() => {
  loadData();
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
  gap: 24rpx;
  margin-top: 24rpx;
}

.tab-btn {
  padding: 12rpx 40rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.15);
  font-size: 26rpx;
  transition: all 0.3s;

  &.active-tab {
    background: white;
    color: #4369f4;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.content-section {
  flex: 1;
  padding: 32rpx;
}

.filter-section {
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  margin-bottom: 32rpx;
}

.filter-header {
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #606266;
  &:active {
    background: #ebeff5;
  }
}

.filter-content {
  padding: 24rpx;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.filter-input {
  flex: 1;
  padding: 20rpx 24rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #f8f9fa;
}

.date-separator {
  color: #909399;
  padding: 0 12rpx;
}

.preference-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
}

.preference-tag {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: #f5f7fa;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #606266;
  checkbox {
    margin-right: 8rpx;
    transform: scale(0.9);
  }
}

.filter-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
  
  button {
    flex: 1;
    padding: 16rpx 24rpx;
    border-radius: 24rpx;
    font-size: 26rpx;
    transition: all 0.2s;
    
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
  
  .reset-btn {
    background: #f0f2f5;
    color: #606266;
  }
  
  .confirm-btn {
    background: #4369f4;
    color: white;
  }
}


.floating-actions {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
}

.fab-button {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  box-shadow: 0 6rpx 18rpx rgba(66, 133, 244, 0.3);
  
  .fab-icon {
    font-size: 40rpx;
  }
}


.fab-icon {
  font-size: 48rpx;
}

.loading-overlay {
  /* 原有加载样式 */
}
</style>