<template>
	<view class="scenic-list">
	    <!-- 景点列表 -->
	    <scroll-view 
			scroll-y 
			class="scenic-container"
			@scrolltolower="loadMore"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
	    >
	    <view class="scenic-grid">
	        <view 
				v-for="(item, index) in scenicList" 
				:key="index"
				class="scenic-item"
				@click="handleDetail(item)"
	        >
	        <image class="cover" :src="item.imageUrl" mode="aspectFill" />
	        <view class="info">
	            <text class="name">{{item.name}}</text>
	            <text class="desc">{{item.description}}</text>
	        </view>
	    </view>
	</view>
	
	    <!-- 加载更多 -->
	    <view v-if="hasMore" class="loading-more">
	        <text>加载中...</text>
	    </view>
	    <view v-else class="no-more">
	        <text>没有更多了</text>
	    </view>
	    </scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { http, ENV_CONFIG } from '@/api/http';
// 状态定义
const scenicList = ref([]);
const loading = ref(false);
const hasMore = ref(true);         // 新增分页控制
const isRefreshing = ref(false);   // 新增下拉刷新状态
const page = ref(1);               // 新增页码控制
const pageSize = 10;               // 每页数量
const handleDetail = (item) => {
  try {
    uni.navigateTo({
      url: `/pages/scenic/scenic?id=${item.id}`
    });
  } catch (error) {
    console.error('导航失败:', error);
    uni.showToast({
      title: '打开详情失败',
      icon: 'none'
    });
  }
};
// 获取景点列表（带分页参数）
// 在script部分修改fetch逻辑
const fetchScenicList = async (pageNum = 1) => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    // 使用封装好的http.get方法，参数通过params传递
    const response = await http.get('/api/scenic-spots', {
      params: { // 正确传递GET参数
        page: pageNum,
        pageSize: pageSize
      }
    });

    // 校验响应数据结构
    if (!response || !response.data || !Array.isArray(response.data.data)) {
      console.error('无效的数据结构:', response);
      throw new Error('服务器返回数据格式异常');
    }

    const newData = response.data.data.map(item => ({
      ...item,
      imageUrl: item.imageUrl ? ENV_CONFIG[process.env.NODE_ENV] + item.imageUrl : ''
    }));

    // 更新列表和分页状态
    scenicList.value = pageNum === 1 
      ? newData 
      : [...scenicList.value, ...newData];
    
    hasMore.value = (pageNum * pageSize) < response.data.total;
    if (hasMore.value) page.value = pageNum;

  } catch (error) {
    uni.showToast({ 
      title: error.message || '加载失败',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
    isRefreshing.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  page.value += 1; // 先递增页码
  fetchScenicList(page.value);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  fetchScenicList(1); // 刷新时重置到第一页
};

// 初始化加载
onMounted(() => fetchScenicList());
</script>


<style lang="scss">
.scenic-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .scenic-container {
    height: 100vh;
  }
  
  .scenic-grid {
    padding: 32rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32rpx;
  }
  
  .scenic-item {
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    
    .cover {
      width: 100%;
      height: 320rpx;
      background-color: #f5f5f5;
    }
    
    .info {
      padding: 16rpx;
      
      .name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
      
      .desc {
        font-size: 24rpx;
        color: #666;
        margin-top: 8rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
  
  .loading-more, .no-more {
    text-align: center;
    padding: 24rpx 0;
    font-size: 24rpx;
    color: #999;
  }
}
</style> 
