<template>
	<view class="auth-container">
		<!-- 顶部logo -->
		<view class="auth-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="title">创建账号</text>
		</view>

		<!-- 注册表单 -->
		<view class="auth-form">
			<!-- 用户名输入 -->
			<view class="form-item" :class="{ error: errors.username }">
				<uni-icons type="person" size="20" color="#2867CE" />
				<input 
					v-model="form.username"
					placeholder="请输入用户名"
					placeholder-class="placeholder"
					maxlength="20"
					@focus="resetError('username')"
				>
			</view>
			<text v-if="errors.username" class="error-tip">{{ errors.username }}</text>
			<!-- 手机号输入 -->
			<view class="form-item" :class="{ error: errors.phone }">
				<uni-icons type="phone" size="20" color="#2867CE" />
				<input 
					v-model="form.phone"
					placeholder="请输入手机号"
					placeholder-class="placeholder"
					maxlength="11"
					@focus="resetError('phone')"
				/>
			</view>
			<text v-if="errors.phone" class="error-tip">{{ errors.phone }}</text>
			<!-- 算式验证码 -->
			<view class="form-item" :class="{ error: errors.captcha }">
				<uni-icons type="chat" size="20" color="#2867CE" />
				<text class="captcha-problem">{{ captchaProblem }}</text>
				<input
					v-model="form.captcha"
					placeholder="请输入计算结果"
					laceholder-class="placeholder"
					maxlength="2"
					@focus="resetError('captcha')"
				/>
				<view class="refresh-icon" @click="generateMathProblem">
					<uni-icons type="refresh" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.captcha" class="error-tip">{{ errors.captcha }}</text>
			<!-- 密码输入 -->
			<view class="form-item" :class="{ error: errors.password }">
				<uni-icons type="locked" size="20" color="#2867CE" />
				<input
					v-model="form.password"
					placeholder="请输入密码"
					placeholder-class="placeholder"
					:password="!showPassword"
					maxlength="20"
					@focus="resetError('password')"
				/>
				<view class="eye-icon" @click="showPassword = !showPassword">
					<uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.password" class="error-tip">{{ errors.password }}</text>
			<!-- 确认密码 -->
			<view class="form-item" :class="{ error: errors.confirmPassword }">
				<uni-icons type="locked" size="20" color="#2867CE" />
				<input
					v-model="form.confirmPassword"
					placeholder="请确认密码"
					placeholder-class="placeholder"
					:password="!showPassword"
					maxlength="20"
					@focus="resetError('confirmPassword')"
				/>
				<view class="eye-icon" @click="showPassword = !showPassword">
					<uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.confirmPassword" class="error-tip">{{ errors.confirmPassword }}</text>
			<!-- 注册按钮 -->
			<button 
				class="auth-btn primary"
				:class="{ disabled: !formValid }"
				:disabled="!formValid || loading"
				@click="handleRegister"
			>
				<text v-if="!loading">注 册</text>
				<uni-load-more v-else status="loading" :icon-size="16" />
			</button>
			<!-- 登录导航 -->
			<view class="auth-footer">
				<text>已有账号？</text>
				<text class="link" @click="navigateTo('/pages/login/login')">立即登录</text>
			</view>
		</view>

		<!-- 协议声明 -->
		<view class="agreement">
			<checkbox-group @change="toggleAgreement">
				<label>
					<checkbox :checked="agreed" color="#4cd964" />
					<text>我已阅读并同意</text>
				</label>
			</checkbox-group>
			<text class="link" @click="showAgreement">《用户协议》</text>
			<text>和</text>
			<text class="link" @click="showPrivacy">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { http } from '@/api/http'	
export default {
	data() {
		return {
			form: {
				username: '',
				phone: '',
				password: '',
				captcha: ''
			},
			errors: {
				username: '',
				phone: '',
				password: '',
				captcha: ''
			},
			captchaProblem: '',
			captchaAnswer: 0,
			showPassword: false,
			agreed: false,
			loading: false
		}
	},
	computed: {
		formValid() {
			return (
				this.form.username && 
				this.form.phone && 
				this.form.password && 
				this.form.captcha &&  
				!Object.values(this.errors).some(err => err) &&
				this.agreed
			)
		}
	},
	created() {
		this.generateMathProblem();
	},
	methods: {
		generateMathProblem() {
			let num1, num2, operator;
			do {
				num1 = Math.floor(Math.random() * 10) + 1;
				num2 = Math.floor(Math.random() * 10) + 1;
				operator = Math.random() < 0.5 ? '+' : '-';
				if (operator === '-' && num1 < num2) {
					[num1, num2] = [num2, num1];
				}
			} while (operator === '-' && num1 - num2 < 0);
		
			this.captchaProblem = `${num1} ${operator} ${num2} = ?`;
			this.captchaAnswer = operator === '+' ? num1 + num2 : num1 - num2;
		},
		// 验证表单
		validate() {
			let valid = true
			// 用户名验证
			if (!this.form.username.trim()) {
				this.errors.username = '请输入用户名'
				valid = false
			} else if (!/^[\w\u4e00-\u9fa5]{4,20}$/.test(this.form.username)) {
				this.errors.username = '用户名格式不正确'
				valid = false
			}
			// 手机号验证
			if (!this.form.phone) {
				this.errors.phone = '请输入手机号'
				valid = false
			} else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
				this.errors.phone = '手机号格式不正确'
				valid = false
			}
			// 密码验证
			if (!this.form.password) {
				this.errors.password = '请输入密码'
				valid = false
			} else if (this.form.password.length < 6) {
				this.errors.password = '密码长度至少6位'
				valid = false
			}
      
			if (!this.form.confirmPassword) {
				this.errors.confirmPassword = '请确认密码'
				valid = false
			} else if (this.form.confirmPassword !== this.form.password) {
				this.errors.confirmPassword = '两次输入的密码不一致'
				valid = false
			}
			// 验证码验证
			if (!this.form.captcha) {
				this.errors.captcha = '请输入验证码';
				valid = false;
			} else if (!/^\d+$/.test(this.form.captcha)) {
				this.errors.captcha = '验证码必须为数字';
				valid = false;
			} else if (parseInt(this.form.captcha) !== this.captchaAnswer) {
				this.errors.captcha = '验证码错误';
				valid = false;
			}
			return valid
		},
    
		// 重置错误
		resetError(field) {
			this.errors[field] = ''
		},
    
		// 协议勾选
		toggleAgreement(e) {
			this.agreed = e.detail.value.length > 0
		},
    
		// 处理注册
		async handleRegister() {
			if (!this.validate()) return
      
			this.loading = true
		try {
			const res = await http.post('/api/auth/register', {
				username: this.form.username,
				phone: this.form.phone,
				password: this.form.password,
				captchaProblem: this.captchaProblem,
				captchaAnswer: this.form.captcha
			})
        
			if (res?.data?.code === 200) {
				uni.showToast({
					title: '注册成功',
					icon: 'success',
					complete: () => {
						uni.navigateTo({ url: '/pages/login/login' })
					}
				})
			} else {
				const message = res?.data?.message || '注册成功';
				uni.showToast({ title: message, icon: 'none' });
			}
		} catch (error) {
			console.error('注册失败:', error)
			uni.showToast({
				title: '网络错误，请稍后重试',
				icon: 'none'
			})
		} finally {
			this.loading = false
		}
    },
    
    // 显示协议
    showAgreement() {
		uni.navigateTo({ url: '/pages/webview?url=' + encodeURIComponent('https://localhost:3000/agreement') })
    },
    
    // 显示隐私政策
    showPrivacy() {
		uni.navigateTo({ url: '/pages/webview?url=' + encodeURIComponent('https://localhost:3000/privacy') })
    },
    
    // 通用跳转
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
  
	.agreement {
		margin-top: auto;
		padding-top: 40rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #999;
    
		checkbox {
			transform: scale(0.8);
		}
    
		.link {
			color: #2867CE;
			margin: 0 5rpx;
		}
	}
}
</style>