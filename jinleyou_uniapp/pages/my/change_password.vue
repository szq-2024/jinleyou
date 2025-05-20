<template>
	<view class="auth-container">
		<!-- 顶部logo -->
		<view class="auth-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="title">修改密码</text>
		</view>

		<!-- 修改密码表单 -->
		<view class="auth-form">
			<!-- 用户名/手机号 -->
			<view class="form-item" :class="{ error: errors.usernameOrPhone }">
				<uni-icons type="person" size="20" color="#2867CE" />
				<input 
					v-model="form.usernameOrPhone"
					placeholder="请输入用户名或手机号"
					placeholder-class="placeholder"
					maxlength="20"
					@focus="resetError('usernameOrPhone')"
				>
			</view>
			<text v-if="errors.usernameOrPhone" class="error-tip">{{ errors.usernameOrPhone }}</text>

			<!-- 原密码 -->
			<view class="form-item" :class="{ error: errors.oldPassword }">
				<uni-icons type="locked" size="20" color="#2867CE" />
				<input
					v-model="form.oldPassword"
					placeholder="请输入原密码"
					placeholder-class="placeholder"
					:password="!showOldPassword"
					maxlength="20"
					@focus="resetError('oldPassword')"
				/>
				<view class="eye-icon" @click="showOldPassword = !showOldPassword">
					<uni-icons :type="showOldPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.oldPassword" class="error-tip">{{ errors.oldPassword }}</text>

			<!-- 新密码 -->
			<view class="form-item" :class="{ error: errors.newPassword }">
				<uni-icons type="locked" size="20" color="#2867CE" />
				<input
					v-model="form.newPassword"
					placeholder="请输入新密码（至少6位数字）"
					placeholder-class="placeholder"
					:password="!showNewPassword"
					maxlength="20"
					@focus="resetError('newPassword')"
				/>
				<view class="eye-icon" @click="showNewPassword = !showNewPassword">
					<uni-icons :type="showNewPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.newPassword" class="error-tip">{{ errors.newPassword }}</text>

			<!-- 确认新密码 -->
			<view class="form-item" :class="{ error: errors.confirmNewPassword }">
				<uni-icons type="locked" size="20" color="#2867CE" />
				<input
					v-model="form.confirmNewPassword"
					placeholder="请确认新密码"
					placeholder-class="placeholder"
					:password="!showNewPassword"
					maxlength="20"
					@focus="resetError('confirmNewPassword')"
				/>
				<view class="eye-icon" @click="showNewPassword = !showNewPassword">
					<uni-icons :type="showNewPassword ? 'eye' : 'eye-slash'" size="20" color="#2867CE" />
				</view>
			</view>
			<text v-if="errors.confirmNewPassword" class="error-tip">{{ errors.confirmNewPassword }}</text>

			<!-- 提交按钮 -->
			<button 
				class="auth-btn primary"
				:class="{ disabled: !formValid }"
				:disabled="!formValid || loading"
				@click="handleChangePassword"
			>
				<text v-if="!loading">提交修改</text>
				<uni-load-more v-else status="loading" :icon-size="16" />
			</button>
		</view>
	</view>
</template>

<script>
import { http } from '@/api/http'
export default {
	data() {
		return {
			form: {
				usernameOrPhone: '',
				oldPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			},
			errors: {
				usernameOrPhone: '',
				oldPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			},
			showOldPassword: false,
			showNewPassword: false,
			loading: false
		}
	},
	computed: {
		formValid() {
			return (
				this.form.usernameOrPhone && 
				this.form.oldPassword && 
				this.form.newPassword && 
				this.form.confirmNewPassword &&  
				!Object.values(this.errors).some(err => err)
			)
		}
	},
	methods: {
		validate() {
			let valid = true
			// 用户名/手机号验证
			if (!this.form.usernameOrPhone.trim()) {
				this.errors.usernameOrPhone = '请输入用户名或手机号'
				valid = false
			} else if (
				!/^(1[3-9]\d{9}|[\w\u4e00-\u9fa5]{4,20})$/.test(this.form.usernameOrPhone)
			) {
				this.errors.usernameOrPhone = '格式不正确'
				valid = false
			}

			// 原密码验证
			if (!this.form.oldPassword) {
				this.errors.oldPassword = '请输入原密码'
				valid = false
			}

			// 新密码验证
			if (!this.form.newPassword) {
				this.errors.newPassword = '请输入新密码'
				valid = false
			} else if (this.form.newPassword.length < 6) {
				this.errors.newPassword = '密码长度至少6位'
				valid = false
			}

			// 确认密码验证
			if (!this.form.confirmNewPassword) {
				this.errors.confirmNewPassword = '请确认密码'
				valid = false
			} else if (this.form.confirmNewPassword !== this.form.newPassword) {
				this.errors.confirmNewPassword = '两次输入的密码不一致'
				valid = false
			}

			return valid
		},
		resetError(field) {
			this.errors[field] = ''
		},
		async handleChangePassword() {
			if (!this.validate()) return
			
			this.loading = true
			try {
				const res = await http.post('/api/auth/change-password', {
					identifier: this.form.usernameOrPhone,
					oldPassword: this.form.oldPassword,
					newPassword: this.form.newPassword
				})

				if (res?.code === 200) {
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						complete: () => {
							uni.navigateBack()
						}
					})
				} else {
					uni.showToast({ 
						title: res?.data?.message || '修改失败', 
						icon: 'none' 
					})
				}
			} catch (error) {
				console.error('修改失败:', error)
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
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