<template>
	<view class="auth-container">
		<!-- 顶部logo -->
		<view class="auth-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="title">欢迎使用津乐游</text>
		</view>

		<!-- 登录表单 -->
		<view class="auth-form">
			<!-- 用户名输入 -->
			<view class="form-item" :class="{ error: errors.username }">
				<uni-icons type="person" size="20" color="#2867CE" />
				<input 
					v-model="form.username"
					placeholder="请输入手机号/用户名"
					placeholder-class="placeholder"
					maxlength="20"
					@focus="resetError('username')"
				/>
			</view>
			<text v-if="errors.username" class="error-tip">{{ errors.username }}</text>
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
			<!-- 表单操作 -->
			<view class="form-actions">
				<view class="remember-me">
					<checkbox-group @change="toggleRemember">
						<label>
							<checkbox :checked="rememberMe" color="#2867CE" />
							<text>记住我</text>
						</label>
					</checkbox-group>
				</view>
				<text class="forgot-password" @click="navigateTo('/pages/forgot-password/index')">忘记密码？</text>
			</view>
			<!-- 登录按钮 -->
			<button 
				class="auth-btn primary"
				:class="{ disabled: !formValid }"
				:disabled="!formValid || loading"
				@click="handleLogin"
			>
				<text v-if="!loading">登 录</text>
				<uni-load-more v-else status="loading" :icon-size="16" />
			</button>
			<!-- 注册引导 -->
			<view class="auth-footer">
				<text>还没有账号？</text>
				<text class="link" @click="navigateTo('/pages/register/index')">立即注册</text>
			</view>
		</view>

		<!-- 第三方登录 -->
		<view class="social-login">
			<view class="divider">
				<text>或通过以下方式登录</text>
			</view>
			<view class="social-icons">
				<button class="icon-btn" open-type="getPhoneNumber" @getphonenumber="onWechatLogin">
					<uni-icons type="weixin" size="24" color="#09BB07" />
				</button>
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
import { mapMutations } from 'vuex'

export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			errors: {
				username: '',
				password: ''
			},
			showPassword: false,
			rememberMe: false,
			agreed: true,
			loading: false
		}
	},
	computed: {
		formValid() {
			return (
				this.form.username && 
				this.form.password && 
				!this.errors.username && 
				!this.errors.password &&
				this.agreed
			)
		}
	},
	onLoad() {
		this.loadRememberedAccount()
	},
	methods: {
		...mapMutations("user", ["SET_INFO"]),
    
		// 初始化记住的账号
		loadRememberedAccount() {
			const account = uni.getStorageSync('rememberedAccount')
			if (account) {
				this.form = { ...account }
				this.rememberMe = true
			}
		},
    
		// 验证表单
		validate() {
			let valid = true
			const { username, password } = this.form
			if (!username.trim()) {
				this.errors.username = '请输入用户名/手机号'
				valid = false
			} else if (!/^[\w\u4e00-\u9fa5]{3,20}$/.test(username)) {
				this.errors.username = '用户名格式不正确'
				valid = false
			}
      
			if (!password) {
				this.errors.password = '请输入密码'
				valid = false
			} else if (password.length < 6) {
				this.errors.password = '密码长度至少6位'
				valid = false
			}
      
			return valid
		},
    
		// 重置错误
		resetError(field) {
			this.errors[field] = ''
		},
    
		// 记住账号
		toggleRemember(e) {
			this.rememberMe = e.detail.value.length > 0
		},
    
		// 协议勾选
		toggleAgreement(e) {
			this.agreed = e.detail.value.length > 0
		},
    
		// 处理登录
		async handleLogin() {
		    if (!this.validate()) return;
		
		    this.loading = true;
		    try {
		        const res = await http.post('/api/auth/login', {
		            account: this.form.username,
		            password: this.form.password
		        });
				console.log('🔍 完整响应结构:', JSON.stringify(res, null, 2));
		        // 存储token和用户信息
		        uni.setStorageSync('token', res.data.token);
		        this.SET_INFO(res.data.user); 
				// 新增：存储userId和avatar到本地存储
				uni.setStorageSync('userId', res.data.user.userId);
				uni.setStorageSync('avatar', res.data.user.avatar); // 同时存储头像
				// 假设后端返回expires_in，单位为秒
				const expiresIn = res.data.expires_in;
				const expireTime = Date.now() + expiresIn * 1000; // 转换为毫秒时间戳
				uni.setStorageSync('tokenExpire', expireTime);
		
		        // 显示成功提示
		        uni.showToast({
		                title: '登录成功',
		                icon: 'success',
		                duration: 1500,
		                success: () => { 
		                    // 关键修改点：使用switchTab
		                    uni.switchTab({
		                        url: '/pages/index/index',
		                        success: () => {
		                            console.log('路由跳转成功');
		                        },
		                        fail: (err) => {
		                            console.error('路由跳转失败:', err);
		                            // 备用跳转方案
		                            uni.reLaunch({ 
		                                url: '/pages/index/index' 
		                            });
		                        }
		                    });
		                }
		            });
					
		
		        // 记住账号
		        if (this.rememberMe) {
		            uni.setStorageSync('rememberedAccount', this.form);
		        } else {
		            uni.removeStorageSync('rememberedAccount');
		        }
		
		    } catch (error) {
		        uni.showToast({
		            title: error.message || '登录失败',
		            icon: 'none'
		        });
		    } finally {
		        this.loading = false;
		    }
		},
    
		// 微信登录
		onWechatLogin(e) {
			console.log('微信登录:', e)
		// 实际处理微信登录逻辑
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
    
		.form-actions {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
			font-size: 26rpx;
      
			.remember-me {
				display: flex;
				align-items: center;
        
				text {
					margin-left: 10rpx;
					color: #666;
				}
			}
      
			.forgot-password {
				color: #2867CE;
			}
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
	}
  
	.social-login {
		margin-top: 80rpx;
    
		.divider {
			position: relative;
			text-align: center;
			color: #999;
			font-size: 26rpx;
			margin-bottom: 40rpx;
      
			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				width: 100rpx;
				height: 1rpx;
				background-color: #e5e5e5;
			}
      
			&::before {
				left: 50rpx;
			}
      
			&::after {
				right: 50rpx;
			}
		}
    
		.social-icons {
			display: flex;
			justify-content: center;
			gap: 80rpx;
      
			.icon-btn {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
				padding: 0;
				margin: 0;
				border: none;
			}
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