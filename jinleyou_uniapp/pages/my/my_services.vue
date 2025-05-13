<template>
  <view class="container">
    <!-- 内容区域 -->
    <view class="content">
      <empty-state
        v-if="!isLoading && services.length === 0"
        description="您还没有发布过导游服务"
        action-text="立即发布"
        @action="navigateToCreate"
      />
      <card-list
        v-else
        :items="services"
        type="guide"
        show-delete
        :show-chat="false"
        @delete="handleDelete"
      />
    </view>

    <!-- 加载状态 -->
    <loading-overlay :visible="isLoading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { http } from '@/api/http';
import CardList from '@/components/CardList.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const services = ref([]);
const isLoading = ref(false);

// 获取用户服务列表
const fetchServices = async () => {
  try {
    isLoading.value = true;
    const response = await http.get('/api/guide-services/my');
    services.value = response.data;
  } catch (error) {
    console.error('获取服务失败:', error);
    uni.showToast({ title: '数据加载失败', icon: 'none' });
  } finally {
    isLoading.value = false;
  }
};

// 处理删除操作
const handleDelete = async (item) => {
  try {
    const { confirm } = await uni.showModal({
      title: '确认删除',
      content: '确定要删除这个服务吗？删除后不可恢复',
    });
    
    if (!confirm) return;

    await http.delete(`/api/guide-services/${item.id}`);
    services.value = services.value.filter(s => s.id !== item.id);
    uni.showToast({ title: '删除成功', icon: 'success' });
  } catch (error) {
    console.error('删除失败:', error);
    uni.showToast({ title: '删除失败', icon: 'none' });
  }
};

// 跳转到创建页面
const navigateToCreate = () => {
  uni.navigateTo({
    url: '/pages/partner/create-guides'
  });
};

onMounted(() => {
  fetchServices();
});
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx;
  min-height: 100vh;
  background-color: #f8f9fb;
}

.header {
  padding: 40rpx 0;
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.content {
  margin-top: 24rpx;
}
</style>