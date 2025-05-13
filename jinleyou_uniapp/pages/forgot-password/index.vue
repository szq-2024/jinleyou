<template>
  <view class="auth-container">
    <!-- 顶部logo -->
    <view class="auth-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">找回密码</text>
    </view>

    <!-- 找回密码表单 -->
    <view class="auth-form">
      <view class="form-item" :class="{ error: errors.phone }">
        <uni-icons type="phone" size="20" color="#999" />
        <input 
          v-model="form.phone"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
          maxlength="11"
          @focus="resetError('phone')"
        />
      </view>
      <text v-if="errors.phone" class="error-tip">{{ errors.phone }}</text>

      <view class="form-item" :class="{ error: errors.code }">
        <uni-icons type="shield" size="20" color="#999" />
        <input 
          v-model="form.code"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
          maxlength="6"
          @focus="resetError('code')"
        />
        <button 
          class="sms-btn" 
          :disabled="countdown > 0 || !canGetCode"
          @click="sendSmsCode"
        >
          {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
        </button>
      </view>
      <text v-if="errors.code" class="error-tip">{{ errors.code }}</text>

      <view class="form-item" :class="{ error: errors.password }">
        <uni-icons type="locked" size="20" color="#999" />
        <input
          v-model="form.password"
          placeholder="请输入新密码"
          placeholder-class="placeholder"
          password
          maxlength="20"
          @focus="resetError('password')"
        />
        <view class="eye-icon" @click="showPassword = !showPassword">
          <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#999" />
        </view>
      </view>
      <text v-if="errors.password" class="error-tip">{{ errors.password }}</text>

      <view class="form-item" :class="{ error: errors.confirmPassword }">
        <uni-icons type="locked" size="20" color="#999" />
        <input
          v-model="form.confirmPassword"
          placeholder="请确认新密码"
          placeholder-class="placeholder"
          password
          maxlength="20"
          @focus="resetError('confirmPassword')"
        />
      </view>
      <text v-if="errors.confirmPassword" class="error-tip">{{ errors.confirmPassword }}</text>

      <button 
        class="auth-btn primary"
        :class="{ disabled: !formValid }"
        :disabled="!formValid || loading"
        @click="handleResetPassword"
      >
        <text v-if="!loading">重置密码</text>
        <uni-load-more v-else status="loading" :icon-size="16" />
      </button>

      <view class="auth-footer">
        <text>记起密码了？</text>
        <text class="link" @click="navigateTo('/pages/login/login')">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      errors: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      countdown: 0,
      loading: false,
      timer: null
    }
  },
  computed: {
    canGetCode() {
      return /^1[3-9]\d{9}$/.test(this.form.phone)
    },
    formValid() {
      return (
        this.form.phone && 
        this.form.code && 
        this.form.password && 
        this.form.confirmPassword && 
        !this.errors.phone && 
        !this.errors.code && 
        !this.errors.password && 
        !this.errors.confirmPassword
      )
    }
  },
  methods: {
    validate() {
      let valid = true
      
      if (!this.form.phone) {
        this.errors.phone = '请输入手机号'
        valid = false
      } else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        this.errors.phone = '手机号格式不正确'
        valid = false
      }
      
      if (!this.form.code) {
        this.errors.code = '请输入验证码'
        valid = false
      } else if (!/^\d{6}$/.test(this.form.code)) {
        this.errors.code = '验证码格式不正确'
        valid = false
      }
      
      if (!this.form.password) {
        this.errors.password = '请输入新密码'
        valid = false
      } else if (this.form.password.length < 6) {
        this.errors.password = '密码长度至少6位'
        valid = false
      }
      
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = '请确认新密码'
        valid = false
      } else if (this.form.confirmPassword !== this.form.password) {
        this.errors.confirmPassword = '两次输入的密码不一致'
        valid = false
      }
      
      return valid
    },
    
    resetError(field) {
      this.errors[field] = ''
    },
    
    async sendSmsCode() {
      if (!this.canGetCode) return
      
      try {
        const res = await uni.request({
          url: '/api/auth/send-sms',
          method: 'POST',
          data: {
            phone: this.form.phone,
            type: 'reset-password'
          }
        })
        
        if (res.data.code === 200) {
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
          this.startCountdown()
        } else {
          uni.showToast({
            title: res.data.message || '发送失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        uni.showToast({
          title: '发送失败，请稍后重试',
          icon: 'none'
        })
      }
    },
    
    startCountdown() {
      this.countdown = 60
      this.timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          return
        }
        this.countdown--
      }, 1000)
    },
    
    async handleResetPassword() {
      if (!this.validate()) return
      
      this.loading = true
      try {
        const res = await uni.request({
          url: '/api/auth/reset-password',
          method: 'POST',
          data: {
            phone: this.form.phone,
            code: this.form.code,
            password: this.form.password
          }
        })
        
        if (res.data.code === 200) {
          uni.showToast({
            title: '密码重置成功',
            icon: 'success',
            complete: () => {
              uni.navigateTo({ url: '/pages/login/login' })
            }
          })
        } else {
          uni.showToast({
            title: res.data.message || '重置失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('重置密码失败:', error)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    navigateTo(url) {
      uni.navigateTo({ url })
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.auth-container {
  padding: 60rpx 50rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .auth-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80rpx;
    
    .logo {
      width: 150rpx;
      height: 150rpx;
      border-radius: 30rpx;
    }
    
    .title {
      font-size: 40rpx;
      font-weight: bold;
      margin-top: 20rpx;
      color: #333;
    }
  }
  
  .auth-form {
    .form-item {
      display: flex;
      align-items: center;
      padding: 25rpx 0;
      border-bottom: 1rpx solid #e5e5e5;
      margin-bottom: 10rpx;
      position: relative;
      
      &.error {
        border-bottom-color: #ff5a5f;
      }
      
      input {
        flex: 1;
        margin-left: 20rpx;
        font-size: 28rpx;
        height: 50rpx;
        line-height: 50rpx;
      }
      
      .placeholder {
        color: #ccc;
        font-size: 28rpx;
      }
      
      .eye-icon {
        padding: 10rpx;
      }
      
      .sms-btn {
        font-size: 24rpx;
        color: #4cd964;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        white-space: nowrap;
        
        &[disabled] {
          color: #999;
        }
      }
    }
    
    .error-tip {
      color: #ff5a5f;
      font-size: 24rpx;
      margin-bottom: 20rpx;
      display: block;
      height: 40rpx;
    }
    
    .auth-btn {
      margin-top: 60rpx;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      border-radius: 45rpx;
      transition: all 0.3s;
      
      &.primary {
        background-color: #4cd964;
        color: #fff;
      }
      
      &.disabled {
        background-color: #ccc;
        opacity: 0.7;
      }
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 30rpx;
      font-size: 26rpx;
      color: #666;
      
      .link {
        color: #4cd964;
        margin-left: 10rpx;
      }
    }
  }
}
</style>