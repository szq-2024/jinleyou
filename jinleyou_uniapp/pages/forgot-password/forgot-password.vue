<template>
  <view class="auth-container">
    <!-- 顶部logo -->
    <view class="auth-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">找回密码</text>
    </view>

    <!-- 密码重置表单 -->
    <view class="auth-form">
      <!-- 账号/手机号输入 -->
      <view class="form-item" :class="{ error: errors.account }">
        <uni-icons type="person" size="20" color="#2867CE" />
        <input
          v-model="form.account"
          placeholder="请输入账号或手机号"
          placeholder-class="placeholder"
          @focus="resetError('account')"
        />
      </view>
      <text v-if="errors.account" class="error-tip">{{ errors.account }}</text>

      <!-- 算式验证码 -->
      <view class="form-item" :class="{ error: errors.captcha }">
        <uni-icons type="chat" size="20" color="#2867CE" />
        <text class="captcha-problem">{{ captchaProblem }}</text>
        <input
          v-model="form.captcha"
          placeholder="请输入计算结果"
          placeholder-class="placeholder"
          maxlength="2"
          @focus="resetError('captcha')"
        />
        <view class="refresh-icon" @click="generateMathProblem">
          <uni-icons type="refresh" size="20" color="#2867CE" />
        </view>
      </view>
      <text v-if="errors.captcha" class="error-tip">{{ errors.captcha }}</text>

      <!-- 新密码 -->
      <view class="form-item" :class="{ error: errors.newPassword }">
        <uni-icons type="locked" size="20" color="#2867CE" />
        <input
          v-model="form.newPassword"
          placeholder="请输入新密码（至少6位）"
          placeholder-class="placeholder"
          :password="!showPassword"
          @focus="resetError('newPassword')"
        />
        <view class="eye-icon" @click="showPassword = !showPassword">
          <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
        </view>
      </view>
      <text v-if="errors.newPassword" class="error-tip">{{ errors.newPassword }}</text>

      <!-- 确认密码 -->
      <view class="form-item" :class="{ error: errors.confirmPassword }">
        <uni-icons type="locked" size="20" color="#2867CE" />
        <input
          v-model="form.confirmPassword"
          placeholder="请确认新密码"
          placeholder-class="placeholder"
          :password="!showPassword"
          @focus="resetError('confirmPassword')"
        />
		<view class="eye-icon" @click="showPassword = !showPassword">
		  <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
		</view>
      </view>
      <text v-if="errors.confirmPassword" class="error-tip">{{ errors.confirmPassword }}</text>

      <!-- 提交按钮 -->
      <button 
        class="auth-btn primary"
        :class="{ disabled: !formValid }"
        :disabled="!formValid || loading"
        @click="handleResetPassword"
      >
        <text v-if="!loading">重置密码</text>
        <uni-load-more v-else status="loading" :icon-size="16" />
      </button>

      <!-- 返回登录 -->
      <view class="auth-footer">
        <text class="link" @click="navigateTo('/pages/login/login')">返回登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { http } from '@/api/http'

export default {
  data() {
    return {
      form: {
        account: '',
        captcha: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {
        account: '',
        captcha: '',
        newPassword: '',
        confirmPassword: ''
      },
      captchaProblem: '',
      captchaAnswer: 0,
      showPassword: false,
      loading: false
    }
  },
  computed: {
    formValid() {
      return (
        this.form.account &&
        this.form.captcha &&
        this.form.newPassword &&
        this.form.confirmPassword &&
        !Object.values(this.errors).some(err => err)
      )
    }
  },
  created() {
    this.generateMathProblem()
  },
  methods: {
    generateMathProblem() {
      let num1, num2, operator
      do {
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        operator = Math.random() < 0.5 ? '+' : '-'
        if (operator === '-' && num1 < num2) {
          [num1, num2] = [num2, num1]
        }
      } while (operator === '-' && num1 - num2 < 0)

      this.captchaProblem = `${num1} ${operator} ${num2} = ?`
      this.captchaAnswer = operator === '+' ? num1 + num2 : num1 - num2
    },

    validate() {
      let valid = true
      
      // 账号验证
      if (!this.form.account.trim()) {
        this.errors.account = '请输入用户名或手机号'
        valid = false
      } else if (!/^(\w{4,20}|1[3-9]\d{9})$/.test(this.form.account)) {
        this.errors.account = '格式不正确'
        valid = false
      }

      // 验证码验证
      if (!this.form.captcha) {
        this.errors.captcha = '请输入验证码'
        valid = false
      } else if (parseInt(this.form.captcha) !== this.captchaAnswer) {
        this.errors.captcha = '验证码错误'
        valid = false
      }

      // 新密码验证
      if (!this.form.newPassword) {
        this.errors.newPassword = '请输入新密码'
        valid = false
      } else if (this.form.newPassword.length < 6) {
        this.errors.newPassword = '密码至少6位'
        valid = false
      }

      // 确认密码验证
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = '请确认密码'
        valid = false
      } else if (this.form.confirmPassword !== this.form.newPassword) {
        this.errors.confirmPassword = '两次输入不一致'
        valid = false
      }

      return valid
    },

    resetError(field) {
      this.errors[field] = ''
    },

    async handleResetPassword() {
      if (!this.validate()) return

      this.loading = true
      try {
        const res = await http.post('/api/auth/reset-password', {
          account: this.form.account,
          newPassword: this.form.newPassword,
          captchaProblem: this.captchaProblem,
          captchaAnswer: this.form.captcha
        })

        if (res?.code === 200) {
          uni.showToast({
            title: '密码重置成功',
            icon: 'success',
            complete: () => {
              this.navigateTo('/pages/login/login')
            }
          })
        } else {
          const message = res?.data?.message || '重置失败，请重试'
          uni.showToast({ title: message, icon: 'none' })
        }
      } catch (error) {
        console.error('密码重置失败:', error)
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
				background-color: #2867CE;
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
				color: #2867CE;
				margin-left: 10rpx;
			}
		}
		
		.captcha-problem {
			margin: 0 10rpx;
			font-weight: bold;
		}
		.refresh-icon {
			padding: 10rpx;
			margin-left: 10rpx;
		}
	}
}
</style>