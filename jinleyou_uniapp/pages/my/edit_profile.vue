<template>
  <view class="edit-container">
    <!-- 
    <uni-nav-bar 
      title="编辑资料" 
      left-icon="back" 
      @clickLeft="goBack"
      :border="false"
      fixed
    />
    -->
    <!-- 表单容器 -->
    <scroll-view scroll-y class="form-container">
      <!-- 头像上传 -->
      <view class="form-item">
        <text class="label">头像</text>
        <view class="avatar-upload" @click="changeAvatar">
          <image class="avatar" :src="form.avatar || '/static/default-avatar.png'" mode="aspectFill" />
          <uni-icons type="camera-filled" size="24" color="#fff" class="camera-icon" />
          <view v-if="uploading" class="upload-progress">
            <text>{{ uploadProgress }}%</text>
          </view>
        </view>
      </view>
      
      <!-- 昵称 -->
      <view class="form-item">
        <text class="label">昵称</text>
        <input 
          v-model="form.nickname" 
          placeholder="请输入2-12位昵称" 
          maxlength="12"
          @blur="validateNickname"
        />
        <text v-if="errors.nickname" class="error-text">{{ errors.nickname }}</text>
      </view>
      
      <!-- 性别 -->
      <view class="form-item">
        <text class="label">性别</text>
        <picker 
          mode="selector" 
          :range="genderOptions" 
          range-key="label"
          @change="onGenderChange"
        >
          <view class="picker">
            {{ genderOptions[form.gender].label || '请选择性别' }}
          </view>
        </picker>
      </view>
      
      <!-- 个人简介 -->
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea 
          v-model="form.bio" 
          placeholder="介绍一下自己吧~"
          maxlength="100"
          auto-height
        />
        <text class="word-count">{{ form.bio.length }}/100</text>
      </view>
      
      <!-- 保存按钮 -->
      <button 
        class="save-btn" 
        :class="{ disabled: !formChanged || hasErrors }"
        :disabled="!formChanged || hasErrors || saving"
        @click="saveProfile"
      >
        <text v-if="!saving">保存修改</text>
        <uni-load-more v-else status="loading" :icon-size="16" :content-text="loadingText" />
      </button>
    </scroll-view>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { http, ENV_CONFIG } from '@/api/http';
export default {
  data() {
    return {
      form: {
        avatar: '',
        nickname: '',
        gender: 0,
        bio: ''
      },
      originalForm: {},
      errors: {
        nickname: ''
      },
      genderOptions: [
        { label: '保密', value: 0 },
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      uploading: false,
      uploadProgress: 0,
      saving: false,
      loadingText: {
        contentdown: '保存中',
        contentrefresh: '保存中',
        contentnomore: '保存中'
      }
    };
  },
	computed: {
		...mapState('user', ['info']), // 映射 user 模块的 info 状态
		userInfo() {
			return this.info || {}; // 保持模板兼容性
		},
		// 检查表单是否有变化
		formChanged() {
			return JSON.stringify(this.form) !== JSON.stringify(this.originalForm);
		},
		// 检查是否有错误
		hasErrors() {
			return this.errors.nickname !== '';
		}
	},
	onLoad() {
		// 初始化表单数据
		this.initFormData();
	},
	onShow() {
		if (!Object.keys(this.userInfo).length) {
			this.getUserInfo(); // 从 my.vue 中提取并复用该方法
		}
	},
  methods: {
	...mapMutations('user', ['SET_INFO']),
    // 初始化表单数据
		initFormData() {
			this.form = {
				avatar: this.userInfo.avatar || '',
				nickname: this.userInfo.nickname || '',
				gender: this.userInfo.gender ?? 0,
				bio: this.userInfo.bio || ''
			};
			this.originalForm = JSON.parse(JSON.stringify(this.form));
		},
    
    // 更换头像
    async changeAvatar() {
        try {
            const res = await uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
				extension: ['jpg', 'jpeg', 'png', 'gif']
            });
    
            if (res.tempFilePaths && res.tempFilePaths.length) {
                this.uploading = true;
                this.uploadProgress = 0;
                
                try {
                    // 直接使用uni.uploadFile API
                    const uploadRes = await uni.uploadFile({
                        url: `${ENV_CONFIG[process.env.NODE_ENV]}/api/user/upload`, 
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: {
                            Authorization: `Bearer ${uni.getStorageSync('token')}`
                        }
                    });
    
                    if (uploadRes.statusCode === 200) {
                        const data = JSON.parse(uploadRes.data);
                        if (data.code === 200) {
                            this.form.avatar = data.url;
                        } else {
                            uni.showToast({ title: data.msg || '上传失败', icon: 'none' });
                        }
                    }
                } catch (error) {
                    console.error('上传失败:', error);
                    uni.showToast({ title: '头像上传失败', icon: 'none' });
                } finally {
                    this.uploading = false;
                }
            }
        } catch (error) {
            console.error('选择图片失败:', error);
            this.uploading = false;
        }
    },
    
    // 性别选择
    onGenderChange(e) {
      this.form.gender = e.detail.value;
    },
    
    // 验证昵称
    validateNickname() {
      if (!this.form.nickname) {
        this.errors.nickname = '昵称不能为空';
      } else if (this.form.nickname.length < 2) {
        this.errors.nickname = '昵称太短';
      } else {
        this.errors.nickname = '';
      }
    },
    
    // 保存资料
    async saveProfile() {
      if (this.saving || !this.formChanged || this.hasErrors) return;
      
      this.saving = true;
      try {
        let updateData = { ...this.form };
        // 如果头像已更新，form.avatar已包含新URL，无需再次上传
        const { code, message } = await http.post('/api/user/update', updateData);
        
        if (code === 200) {
          uni.showToast({ title: '修改成功', icon: 'success' });
          this.SET_INFO(this.form);
          setTimeout(() => uni.navigateBack(), 1500);
        } else {
          uni.showToast({ title: message, icon: 'none' });
        }
      } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({ title: '保存失败，请重试', icon: 'none' });
      } finally {
        this.saving = false;
      }
    },
    
    goBack() {
      if (this.formChanged) {
        uni.showModal({
          title: '提示',
          content: '您有未保存的修改，确定要离开吗？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack();
            }
          }
        });
      } else {
        uni.navigateBack();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
  
  .form-container {
    flex: 1;
    padding: 30rpx;
	width: 100vw;
	box-sizing: border-box;
    
    .form-item {
	  overflow: visible;
	  width: 100%;
      margin-bottom: 40rpx;
      background-color: #fff;
      padding: 30rpx;
      border-radius: 12rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
      
      .label {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
      }
      
      input, textarea, .picker {
        width: 100%;
        font-size: 28rpx;
        padding: 10rpx 0;
        border-bottom: 1rpx solid #eee;
      }
      
      textarea {
        min-height: 120rpx;
      }
      
      .error-text {
        color: #ff5a5f;
        font-size: 24rpx;
        margin-top: 10rpx;
        display: block;
      }
      
      .word-count {
        color: #999;
        font-size: 24rpx;
        text-align: right;
        display: block;
        margin-top: 10rpx;
      }
      
      .avatar-upload {
        position: relative;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        overflow: hidden;
        
        .avatar {
          width: 100%;
          height: 100%;
        }
        
        .camera-icon {
          position: absolute;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 8rpx;
          border-radius: 50%;
        }
        
        .upload-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          
          text {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }
    
    .save-btn {
      margin-top: 60rpx;
      background-color: #4cd964;
      color: #fff;
      border: none;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      border-radius: 40rpx;
      
      &.disabled {
        background-color: #ccc;
        opacity: 0.7;
      }
    }
  }
}
</style>