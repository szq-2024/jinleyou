<template>
  <view class="settings-container">
    <!-- 简化后的导航栏 -->
    <view class="nav-bar">
      <uni-icons type="arrowleft" size="24" color="#333" @click="goBack" />
      <view class="right-placeholder" />
    </view>

    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 账号设置 -->
      <view class="section-title">账号设置</view>
      <view class="setting-item" @click="navigateTo('/pages/my/change_password')">
        <view class="item-left">
          <uni-icons type="locked" size="20" color="#666" />
          <text>修改密码</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>

      <!-- 权限管理 -->
      <!--<view class="section-title">权限管理</view>
      <view class="setting-item">
        <view class="item-left">
          <uni-icons type="location" size="20" color="#666" />
          <text>定位权限</text>
        </view>
        <view class="item-right">
          <switch 
            :checked="locationPermission === 'authorized'" 
            @change="handleSwitchChange"
            color="#2867CE"
            class="permission-switch"
          />
        </view>
      </view>-->
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn">
      <button @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      locationPermission: 'unknown'
    }
  },
  onShow() {
    this.checkPermissionStatus()
  },
  methods: {
    async checkPermissionStatus() {
      try {
        const res = await uni.getSetting()
        const status = res.authSetting['scope.userLocation']
        this.locationPermission = status ? 'authorized' : 'denied'
      } catch (e) {
        console.error('获取权限状态失败:', e)
        this.locationPermission = 'unknown'
      }
    },

    async handleSwitchChange(e) {
      const isOn = e.detail.value
      if (isOn) {
        try {
          await uni.authorize({ scope: 'scope.userLocation' })
          this.locationPermission = 'authorized'
          uni.showToast({ title: '定位权限已开启', icon: 'success' })
        } catch (error) {
          uni.showModal({
            title: '位置权限申请',
            content: '需要位置权限来提供应急导航服务，请前往设置开启',
            confirmText: '立即开启',
            success: async (res) => {
              if (res.confirm) {
                const { authSetting } = await uni.openSetting()
                if (authSetting['scope.userLocation']) {
                  this.locationPermission = 'authorized'
                  uni.showToast({ title: '权限已开启', icon: 'success' })
                } else {
                  this.locationPermission = 'denied'
                }
              }
            }
          })
        }
      } else {
        uni.showModal({
          title: '关闭定位权限',
          content: '需要到系统设置中关闭定位权限，是否立即前往？',
          confirmText: '前往设置',
          success: async (res) => {
            if (res.confirm) {
              await uni.openSetting()
              this.checkPermissionStatus()
            }
          }
        })
      }
    },

    navigateTo(url) {
      uni.navigateTo({ url })
    },

    goBack() {
      uni.navigateBack()
    },

    logout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出当前账号吗？',
        success: (res) => {
          if (res.confirm) {
            uni.reLaunch({ url: '/pages/login/login' })
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
        
        .permission-switch {
          transform: scale(0.85);
          transform-origin: right center;
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