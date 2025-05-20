<template>
  <view class="container">
    <!-- 内容区域 -->
    <view class="content">
      <empty-state
        v-if="!isLoading && reviews.length === 0"
        description="您还没有发表过任何评论"
      />
      <card-list
        v-else
        :items="reviews"
        type="review"
        show-delete
        @delete="handleDelete"
      />
    </view>

    <!-- 加载状态 -->
    <loading-overlay :visible="isLoading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { http, ENV_CONFIG } from '@/api/http';
import CardList from '@/components/CardList.vue';
import EmptyState from '@/components/EmptyState.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const reviews = ref([]);
const isLoading = ref(false);

// 获取用户评论列表
const fetchReviews = async () => {
   try {
       isLoading.value = true;
       const response = await http.get('/api/user/reviews');
       
       reviews.value = response.data.map(review => {
                // 确保使用后端返回的 images 字段
                const processed = {
                  ...review,
				  id: review.reviewId,
                  images: review.images.map(img => { // 使用正确的字段名
                    const processedUrl = img.startsWith('http') ? img : `${ENV_CONFIG[process.env.NODE_ENV]}${img}`;
                    return processedUrl;
                  })
                };
                return processed;
              });
     } catch (error) {
    console.error('获取评论失败:', error);
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
      content: '确定要删除这条评论吗？删除后不可恢复',
    });
    
    if (!confirm) return;

    await http.delete(`/api/user/reviews/${item.id}`);
    reviews.value = reviews.value.filter(r => r.id !== item.id);
    uni.showToast({ title: '删除成功', icon: 'success' });
  } catch (error) {
    console.error('删除失败:', error);
    uni.showToast({ title: '删除失败', icon: 'none' });
  }
};

// 跳转到点评页面
const navigateToReview = () => {
  uni.navigateTo({
    url: '/pages/review/review'
  });
};

onMounted(() => {
  fetchReviews();
});
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx;
  min-height: 100vh;
  background-color: #f8f9fb;
}

.content {
  margin-top: 24rpx;
}
::v-deep .delete-button {
  background: #007aff !important;
}
</style>