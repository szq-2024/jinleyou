<!-- /pages/my/my-comments.vue -->
<template>
  <view class="comments-container">
    <!-- 导航栏 -->
    <uni-nav-bar 
      title="我的评论" 
      left-icon="back" 
      @clickLeft="back"
      :border="false"
      fixed
    />
    
    <!-- 评论列表 -->
    <scroll-view 
      scroll-y 
      class="comment-list"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 评论项 -->
      <view 
        v-for="(item, index) in comments" 
        :key="item.id" 
        class="comment-item"
      >
        <view class="comment-header">
          <image 
            class="avatar" 
            :src="item.user.avatar || '/static/default-avatar.png'" 
            mode="aspectFill" 
          />
          <view class="user-info">
            <text class="username">{{ item.user.nickname }}</text>
            <text class="time">{{ formatTime(item.create_time) }}</text>
          </view>
          <view class="delete-btn" @click.stop="showDeleteDialog(item.id, index)">
            <uni-icons type="trash" size="18" color="#999"></uni-icons>
          </view>
        </view>
        
        <view class="comment-content">
          <text>{{ item.content }}</text>
        </view>
        
        <view class="comment-footer" @click="toTarget(item.target_id, item.type)">
          <text class="target">评论于: {{ getTargetType(item.type) }}</text>
          <uni-icons type="arrowright" size="16" color="#999"></uni-icons>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-state">
        <text v-if="loading" class="loading-text">加载中...</text>
        <text v-if="noMore" class="no-more-text">没有更多了</text>
      </view>
      
      <!-- 空状态 -->
      <view v-if="comments.length === 0 && !loading" class="empty-container">
        <image src="/static/empty-comment.png" class="empty-image" />
        <text class="empty-text">暂无评论记录</text>
        <button class="refresh-btn" @click="loadComments">重新加载</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { formatTime } from '@/utils/util.js';

export default {
  data() {
    return {
      comments: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      refreshing: false
    };
  },
  onLoad() {
    this.loadComments();
  },
  methods: {
    // 加载评论
    async loadComments() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const res = await uni.request({
          url: '/api/comments/my',
          method: 'GET',
          data: {
            page: this.page,
            page_size: this.pageSize
          },
          header: {
            'Authorization': uni.getStorageSync('token')
          }
        });
        
        if (res.data.code === 200) {
          const data = res.data.data;
          this.comments = this.page === 1 ? data.list : [...this.comments, ...data.list];
          this.noMore = data.list.length < this.pageSize;
        }
      } catch (error) {
        console.error('获取评论失败:', error);
        uni.showToast({
          title: '获取评论失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
    
    // 下拉刷新
    onRefresh() {
      this.refreshing = true;
      this.page = 1;
      this.loadComments();
    },
    
    // 上拉加载更多
    loadMore() {
      if (this.loading || this.noMore) return;
      this.page++;
      this.loadComments();
    },
    
    // 显示删除确认对话框
    showDeleteDialog(commentId, index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条评论吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.deleteComment(commentId, index);
          }
        }
      });
    },
    
    // 删除评论
    async deleteComment(commentId, index) {
      try {
        const res = await uni.request({
          url: `/api/comments/${commentId}`,
          method: 'DELETE',
          header: {
            'Authorization': uni.getStorageSync('token')
          }
        });
        
        if (res.data.code === 200) {
          uni.showToast({
            title: '删除成功'
          });
          this.comments.splice(index, 1);
        }
      } catch (error) {
        console.error('删除评论失败:', error);
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    },
    
    // 跳转到评论目标
    toTarget(targetId, type) {
      let url = '';
      switch (type) {
        case 'article':
          url = `/pages/article/detail?id=${targetId}`;
          break;
        case 'product':
          url = `/pages/product/detail?id=${targetId}`;
          break;
        // 其他类型...
        default:
          return;
      }
      uni.navigateTo({ url });
    },
    
    // 获取评论目标类型
    getTargetType(type) {
      const types = {
        article: '文章',
        product: '商品',
        video: '视频'
        // 其他类型...
      };
      return types[type] || '未知类型';
    },
    
    // 格式化时间
    formatTime,
    
    // 返回
    back() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.comments-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  
  .comment-list {
    flex: 1;
    padding: 20rpx;
    
    .comment-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
      
      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .username {
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 6rpx;
          }
          
          .time {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .delete-btn {
          padding: 10rpx;
        }
      }
      
      .comment-content {
        font-size: 28rpx;
        line-height: 1.6;
        margin-bottom: 20rpx;
        color: #333;
      }
      
      .comment-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16rpx;
        border-top: 1rpx solid #f0f0f0;
        
        .target {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
    
    .loading-state {
      text-align: center;
      padding: 30rpx 0;
      
      .loading-text {
        font-size: 26rpx;
        color: #999;
      }
      
      .no-more-text {
        font-size: 26rpx;
        color: #ccc;
      }
    }
    
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100rpx;
      
      .empty-image {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 30rpx;
      }
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 40rpx;
      }
      
      .refresh-btn {
        width: 200rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
        background-color: #007aff;
        color: #fff;
        border-radius: 35rpx;
      }
    }
  }
}
</style>