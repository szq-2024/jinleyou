<template>
  <view class="settings-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <uni-icons type="arrowleft" size="24" color="#333" @click="goBack" />
      <text class="title">设置</text>
      <view class="right-placeholder"></view>
    </view>

    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 账号设置 -->
      <view class="section-title">账号设置</view>
      <view class="setting-item" @click="navigateTo('/pages/my/edit-profile')">
        <view class="item-left">
          <uni-icons type="person" size="20" color="#666" />
          <text>个人资料</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>

      <view class="setting-item" @click="navigateTo('/pages/my/change-password')">
        <view class="item-left">
          <uni-icons type="locked" size="20" color="#666" />
          <text>修改密码</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>

      <!-- 通知设置 -->
      <view class="section-title">通知设置</view>
      <view class="setting-item">
        <view class="item-left">
          <uni-icons type="sound" size="20" color="#666" />
          <text>消息通知</text>
        </view>
        <switch :checked="notificationEnabled" @change="toggleNotification" />
      </view>

      <!-- 通用设置 -->
      <view class="section-title">通用设置</view>
      <view class="setting-item" @click="navigateTo('/pages/my/clear-cache')">
        <view class="item-left">
          <uni-icons type="trash" size="20" color="#666" />
          <text>清除缓存</text>
        </view>
        <view class="item-right">
          <text class="cache-size">{{ cacheSize }}</text>
          <uni-icons type="arrowright" size="16" color="#ccc" />
        </view>
      </view>

      <view class="setting-item" @click="checkUpdate">
        <view class="item-left">
          <uni-icons type="download" size="20" color="#666" />
          <text>检查更新</text>
        </view>
        <view class="item-right">
          <text class="version">v{{ appVersion }}</text>
          <uni-icons type="arrowright" size="16" color="#ccc" />
        </view>
      </view>

      <!-- 关于我们 -->
      <view class="section-title">关于</view>
      <view class="setting-item" @click="navigateTo('/pages/my/about-us')">
        <view class="item-left">
          <uni-icons type="info" size="20" color="#666" />
          <text>关于我们</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>

      <view class="setting-item" @click="showAgreement">
        <view class="item-left">
          <uni-icons type="paperclip" size="20" color="#666" />
          <text>用户协议</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>

      <view class="setting-item" @click="showPrivacy">
        <view class="item-left">
          <uni-icons type="eye" size="20" color="#666" />
          <text>隐私政策</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn">
      <button @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      notificationEnabled: true,
      cacheSize: '12.5MB',
      appVersion: '1.0.0'
    }
  },
  onLoad() {
    this.getAppInfo()
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 通用跳转方法
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    
    // 获取应用信息
    getAppInfo() {
      // 获取版本号
      const accountInfo = uni.getAccountInfoSync()
      this.appVersion = accountInfo.miniProgram.version || '1.0.0'
      
      // 获取缓存大小（模拟）
      this.cacheSize = this.calculateCacheSize()
    },
    
    // 计算缓存大小（模拟）
    calculateCacheSize() {
      const size = Math.random() * 10 + 5
      return size.toFixed(1) + 'MB'
    },
    
    // 切换通知设置
    toggleNotification(e) {
      this.notificationEnabled = e.detail.value
      uni.showToast({
        title: this.notificationEnabled ? '已开启通知' : '已关闭通知',
        icon: 'none'
      })
    },
    
    // 检查更新
    checkUpdate() {
      uni.showLoading({ title: '检查中...' })
      
      // 模拟网络请求
      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '提示',
          content: '当前已是最新版本',
          showCancel: false
        })
      }, 1000)
    },
    
    // 显示用户协议
    showAgreement() {
      uni.navigateTo({
        url: '/pages/webview?url=' + encodeURIComponent('https://yourdomain.com/agreement')
      })
    },
    
    // 显示隐私政策
    showPrivacy() {
      uni.navigateTo({
        url: '/pages/webview?url=' + encodeURIComponent('https://yourdomain.com/privacy')
      })
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
              url: '/pages/auth/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
  
  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
    
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
    
    .right-placeholder {
      width: 40rpx;
    }
  }
  
  .settings-list {
    background-color: #fff;
    margin-top: 20rpx;
    
    .section-title {
      padding: 20rpx 30rpx;
      font-size: 26rpx;
      color: #999;
      border-bottom: 1rpx solid #f5f5f5;
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .item-left {
        display: flex;
        align-items: center;
        
        text {
          margin-left: 20rpx;
          font-size: 30rpx;
          color: #333;
        }
      }
      
      .item-right {
        display: flex;
        align-items: center;
        
        .cache-size, .version {
          font-size: 26rpx;
          color: #999;
          margin-right: 10rpx;
        }
      }
      
      &:active {
        background-color: #f9f9f9;
      }
    }
  }
  
  .logout-btn {
    margin-top: 60rpx;
    padding: 0 30rpx;
    
    button {
      background-color: #fff;
      color: #2867CE;
      border: none;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      border-radius: 10rpx;
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>