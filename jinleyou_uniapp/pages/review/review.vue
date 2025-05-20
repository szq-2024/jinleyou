<template>
  <view class="review-container">
    <scroll-view scroll-y class="form-content">
      <!-- 评论内容 -->
      <view class="input-box">
        <textarea
          v-model="content"
          placeholder="写下你的游玩体验..."
          maxlength="500"
          auto-height
          class="comment-input"
        />
        <text class="word-count">{{ content.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="upload-section">
        <text class="section-title">添加图片（最多9张）</text>
        <view class="image-list">
          <view 
            v-for="(img, index) in imageList"
            :key="img.url"
            class="image-item"
          >
            <image 
              :src="img.url" 
              class="preview-image"
              mode="aspectFill"
              @click="previewImage(index)"
              @error="handleImageError(index)"  
            />
            <uni-icons 
              type="close" 
              size="20" 
              color="#fff" 
              class="delete-icon"
              @click="deleteImage(index)"
            />
            <view v-if="img.uploading" class="upload-mask">
              <progress 
                :percent="img.progress" 
                stroke-width="4"
                class="progress"
              />
            </view>
          </view>
          
          <view 
            v-if="imageList.length < 9"
            class="upload-btn"
            @click="chooseImage"
          >
            <uni-icons type="plusempty" size="40" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button 
        class="submit-btn"
        :class="{ disabled: !canSubmit || submitting }"
        :disabled="!canSubmit || submitting"
        @click="submitReview"
      >
        <text v-if="!submitting">提交评论</text>
        <uni-load-more v-else status="loading" :icon-size="16" />
      </button>
    </scroll-view>
  </view>
</template>

<script>
import { http, ENV_CONFIG } from '@/api/http';

export default {
  data() {
    return {
      scenicId: null,
      content: '',
      imageList: [], // {url: string, uploading: bool, progress: number}
      submitting: false
    };
  },
  computed: {
    canSubmit() {
      return this.content.trim().length >= 5 && 
        !this.imageList.some(img => img.uploading)
    }
  },
  onLoad(options) {
    this.scenicId = options.id;
  },
  methods: {
    // 选择图片
    async chooseImage() {
      const remain = 9 - this.imageList.length;
      if (remain <= 0) return;
      
      try {
        const res = await uni.chooseImage({
          count: remain,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });

        res.tempFilePaths.forEach(path => {
          this.imageList.push({
            url: path,
            uploading: true,
            progress: 0
          });
          this.uploadImage(path, this.imageList.length - 1);
        });
      } catch (error) {
        uni.showToast({ title: '选择图片失败', icon: 'none' });
      }
    },

    // 上传单张图片
    async uploadImage(filePath, index) {
      try {
        const uploadRes = await new Promise((resolve, reject) => {
          const uploadTask = uni.uploadFile({
            url: `${ENV_CONFIG[process.env.NODE_ENV]}/api/scenic-spots/upload`,
            filePath,
            name: 'file',
            header: {
              Authorization: `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });

          uploadTask.onProgressUpdate = (res) => {
            this.imageList[index].progress = res.progress;
            if (res.progress === 100) {
              setTimeout(() => {
                this.imageList[index].uploading = false;
              }, 300);
            }
          };
        });

        if (uploadRes.statusCode !== 200) {
          throw new Error(`上传失败，状态码：${uploadRes.statusCode}`);
        }

        const data = JSON.parse(uploadRes.data);
        if (data.code !== 200) {
          throw new Error(data.msg || '上传失败');
        }

        const fullUrl = data.data.url.startsWith('http') 
          ? data.data.url 
          : `${ENV_CONFIG[process.env.NODE_ENV]}${data.data.url}`;
        
        this.imageList[index].url = fullUrl;
        this.imageList[index].uploading = false;

      } catch (error) {
        this.imageList.splice(index, 1);
        uni.showToast({ 
          title: `上传失败: ${error.message}`,
          icon: 'none',
          duration: 3000
        });
      }
    },

    // 删除图片
    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.imageList.splice(index, 1);
          }
        }
      });
    },

    // 图片加载失败处理
    handleImageError(index) {
      this.imageList.splice(index, 1);
      uni.showToast({ 
        title: '图片加载失败，已移除',
        icon: 'none'
      });
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.imageList.map(img => img.url)
      });
    },

    // 提交评论
    async submitReview() {
      if (!this.canSubmit || this.submitting) return;
      
      this.submitting = true;
      
      if (!this.scenicId) {
        uni.showToast({ title: '参数错误，无法提交评论', icon: 'none' });
        return;
      }

      try {
        const images = this.imageList.map(img => img.url);
        
        const { code, msg } = await http.post(
          `/api/scenic-spots/${this.scenicId}/reviews`, 
          {
            content: this.content.trim(),
            images
          }
        );

        if (code === 200) {
          uni.showToast({ title: '评论提交成功' });
          // 修改事件名称与详情页监听一致
          uni.$emit('review-submitted'); 
          setTimeout(() => uni.navigateBack(), 1500);
        } else {
          uni.showToast({ title: msg || '提交失败', icon: 'none' });
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({ title: '提交失败，请重试', icon: 'none' });
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.review-container {
  height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  
  .form-content {
    padding: 30rpx;
    height: calc(100vh - var(--window-top));
    box-sizing: border-box;
    
    .input-box {
      background: #fff;
      padding: 30rpx;
      border-radius: 12rpx;
      margin-bottom: 30rpx;
      
      .comment-input {
        width: 100%;
        min-height: 200rpx;
        font-size: 28rpx;
        box-sizing: border-box;
      }
      
      .word-count {
        color: #999;
        font-size: 24rpx;
        text-align: right;
        display: block;
        margin-top: 20rpx;
      }
    }
    
    .upload-section {
      background: #fff;
      padding: 30rpx;
      border-radius: 12rpx;
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .image-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .image-item, .upload-btn {
          width: calc((100% - 40rpx) / 3); /* 三列布局 */
          aspect-ratio: 1; /* 保持正方形 */
          border-radius: 8rpx;
          position: relative;
          overflow: hidden;
          background: #f8f8f8;
        }
        
        .image-item {
          .preview-image {
            width: 100%;
            height: 100%;
          }
          
          .delete-icon {
            position: absolute;
            right: 8rpx;
            top: 8rpx;
            background: rgba(0,0,0,0.5);
            border-radius: 50%;
            padding: 4rpx;
          }
          
          .upload-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            
            .progress {
              width: 80%;
            }
          }
        }
        
        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2rpx dashed #ccc;
        }
      }
    }
    
    .submit-btn {
      width: 100%;
      background: #2867CE;
      color: #fff;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      font-size: 32rpx;
      margin-top: 30rpx;
      
      &.disabled {
        background: #ccc;
        opacity: 0.7;
      }
    }
  }
}
</style>