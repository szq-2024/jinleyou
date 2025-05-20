<template>
  <view class="my-container">
    <!-- 用户信息卡片 -->
    <view class="user-card" @click="toEditProfile">
      <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" />
      <view class="user-info">
        <text class="username">
          {{ userInfo?.nickname || (isLoading ? '加载中...' : '未设置昵称') }}
        </text>
        <text class="edit-tip">点击修改资料</text>
      </view>
      <uni-icons type="arrowright" size="18" color="#999" />
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="handleNavigate('/pages/my/my_messages')">
        <view class="item-content">
          <uni-icons type="heart-filled" size="20" color="#ff5a5f" />
          <text>我的消息</text>
		    <!-- 新增未读标识 -->
		    <view v-if="unreadCount > 0" class="unread-badge">
		    {{ unreadCount > 99 ? '99+' : unreadCount }}
			</view>
        </view>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>

      <view class="menu-item" @click="handleNavigate('/pages/my/my_review')">
        <view class="item-content">
          <uni-icons type="chatboxes-filled" size="20" color="#007aff" />
          <text>我的评论</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>

      <view class="menu-item" @click="handleNavigate('/pages/my/my_trips')">
        <view class="item-content">
          <uni-icons type="calendar-filled" size="20" color="#4cd964" />
          <text>我的行程</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>

	<!-- 在.menu-list中添加 -->
	<view class="menu-item" @click="handleNavigate('/pages/my/my_services')">
	  <view class="item-content">
	    <uni-icons type="star-filled" size="20" color="#8A2BE2" />
	    <text>我的服务</text>
	  </view>
	  <uni-icons type="arrowright" size="16" color="#999" />
	</view>
	
      <view class="menu-item" @click="handleNavigate('/pages/my/setting')">
        <view class="item-content">
          <uni-icons type="gear-filled" size="20" color="#808080" />
          <text>设置</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn">
      <button @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { http } from '@/api/http';
export default {
	data() {
		return {
			isLoading: false,
		    unreadCount: 0,
		    pollInterval: null
		};
	},
	computed: {
		...mapState("user", ["info"]),
		userInfo() {
			return this.info || {}; 
		}
	},
  onLoad() {
    this.getUserInfo();
  },
	onShow() {
	  this.getUserInfo(); 
	  this.fetchUnreadCount();
	  this.startPolling();
	},
	onHide() {
	  clearInterval(this.pollInterval);
	},
	
	onUnload() {
	  clearInterval(this.pollInterval);
	},
	methods: {
		...mapMutations("user", ["SET_INFO", "CLEAR_ALL"]),
		checkTokenExpiration() {
			const token = uni.getStorageSync("token");
			const expireTime = uni.getStorageSync("tokenExpire");
			console.debug('Token验证:', { 
			    tokenExists: !!token,
			    expireTime: new Date(expireTime * 1000).toLocaleString(),
			    currentTime: new Date().toLocaleString() 
			});
			// 假设 expireTime 存储的是秒，转换为毫秒
			if (!token || Date.now() > expireTime) { 
			    this.CLEAR_ALL();
			    return false;
			}
			return true;
		},
		// 获取未读消息数量
		async fetchUnreadCount() {
		  try {
		    const res = await http.get('/api/chat/unread-count');
		    console.log('未读消息响应:', res);
		    
		    if (res.code === 200 && typeof res.data === 'number') {
		      this.unreadCount = res.data;
		    } else {
		      this.unreadCount = 0;
		    }
		  } catch (error) {
		    console.error('获取未读消息失败:', error);
		    this.unreadCount = 0;
		  }
		},
		
		  // 启动轮询
		  startPolling() {
		    this.pollInterval = setInterval(() => {
		      this.fetchUnreadCount();
		    }, 5000);
			console.log('开始轮询未读消息...');
		  },
		// 获取用户信息
		// 修改后的getUserInfo方法
		async getUserInfo() {
		  this.isLoading = true;
		  try {
		    const res = await http.get("/api/user/info");
		    if (res.code === 200) {
		      const userData = {
		        nickname: res.data.nickname,
		        avatar: res.data.avatar, // 使用后端返回的完整URL
		        gender: res.data.gender,
		        bio: res.data.bio
		      };
		      this.SET_INFO(userData);
		    }
		  } catch (err) {
		    console.error('用户信息获取失败:', err);
		  } finally {
		    this.isLoading = false;
		  }
		},

    // 处理导航跳转
    handleNavigate(url) {
      const checkToken = this.checkTokenExpiration();
      if (!checkToken) {
              uni.showModal({ // 使用 uni.showModal
                title: "提示",
                content: "请先登录",
                success: (res) => {
                  if (res.confirm) {
                    uni.navigateTo({ url: "/pages/login/login" });
                  }
                }
              });
              return;
            }
      // 仅在用户信息为空时重新获取
      if (!this.userInfo || Object.keys(this.userInfo).length === 0) {
        this.getUserInfo();
      }
      // 统一路径处理
      const targetPath = url.replace("/pages/", "").replace(/\.html$/, "");
      const currentPath = getCurrentPages().pop().route;
      if (currentPath !== targetPath) {
        uni.navigateTo({ url });
      }
    },

    // 跳转编辑资料
    toEditProfile() {
      this.handleNavigate('/pages/my/edit_profile');
    },

    // 退出登录
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息和token
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            
            // 跳转到登录页面
            uni.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;

  .user-card {
    display: flex;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .username {
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .edit-tip {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .menu-list {
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }

      .item-content {
        display: flex;
        align-items: center;
        
        text {
          margin-left: 20rpx;
          font-size: 32rpx;
        }
      }
    }
  }

  .logout-btn {
    margin-top: 40rpx;
    
    button {
      background-color: #fff;
      color: #2867CE;
      border: none;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      border-radius: 10rpx;
    }
  }
}
  .unread-badge {
    background: #ff5a5f;
    color: white;
    min-width: 36rpx;
    height: 36rpx;
    line-height: 36rpx;
    border-radius: 18rpx;
    font-size: 24rpx;
    text-align: center;
    padding: 0 8rpx;
    margin-left: 16rpx;
  }
</style>