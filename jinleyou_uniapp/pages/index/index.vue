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
	
import { onLoad } from '@dcloudio/uni-app'
import { ref, onMounted } from 'vue'

// 景点列表数据
const scenicList = ref([
  {
    id: '1',
    name: '天津之眼',
    description: '世界上唯一建在桥上的摩天轮，天津地标性建筑',
    imageUrl: '/static/photo/tianjinzhiyan.jpg'
  },
  {
    id: '2',
    name: '五大道',
    description: '天津最具特色的洋楼建筑群，被誉为"万国建筑博览苑"',
    imageUrl: '/static/photo/wudadao.jpg'
  },
  {
    id: '3',
    name: '古文化街',
    description: '天津老字号店铺和手工艺品集中地，体验津门文化',
    imageUrl: '/static/photo/guwenhuajie.jpg'
  },
  {
    id: '4',
    name: '意式风情区',
    description: '亚洲最大的意式建筑群，感受异国风情',
    imageUrl: '/static/photo/yishifengqingqu.jpg'
  },
  {
    id: '5',
    name: '海河',
    description: '天津的母亲河，两岸风光旖旎，夜景迷人',
    imageUrl: '/static/photo/haihe.jpg'
  },
  {
    id: '6',
    name: '瓷房子',
    description: '用古瓷器装饰的独特建筑，世界建筑史上的奇迹',
    imageUrl: '/static/photo/cifangzi.jpg'
  },
  {
    id: '7',
    name: '天津博物馆',
    description: '展示天津历史文化的重要场所，馆藏丰富',
    imageUrl: '/static/photo/tianjinbowuguan.jpg'
  },
  {
    id: '8',
    name: '盘山',
    description: '天津著名的自然风景区，有"京东第一山"之称',
    imageUrl: '/static/photo/panshan.jpg'
  }
])

// 分页相关
const page = ref(1)
const hasMore = ref(false)
const isRefreshing = ref(false)

// 加载更多
const loadMore = () => {
  if (hasMore.value) {
    page.value++
    // TODO: 加载更多数据
  }
}

// 下拉刷新
const onRefresh = async () => {
  isRefreshing.value = true
  // TODO: 刷新数据
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

// 查看详情
const handleDetail = (item) => {
  uni.navigateTo({
    url: `/pages/scenic/scenic?id=${item.id}`,
    success: () => {
      console.log('跳转详情页成功', item.id);
    },
    fail: (err) => {
      console.error('跳转详情页失败', err);
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      });
    }
  });
}

// 页面加载
onMounted(() => {
  // TODO: 获取景点列表数据
})
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
