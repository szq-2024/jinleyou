<template>
	<view class="scenic-detail-container">
		
		<!-- 图片轮播区 -->
		<swiper class="image-swiper" indicator-dots autoplay circular>
			<swiper-item v-for="(img, index) in scenicData.images" :key="index">
				<image class="swiper-image" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>

		<!-- 景点基本信息 -->
		<view class="basic-info">
			<view class="title-section">
				<text class="scenic-name">{{ scenicData.name }}</text>
			</view>

			<view class="info-row">
				<uni-icons type="location-filled" size="18" color="#666"></uni-icons>
				<text class="info-text">{{ scenicData.address }}</text>
			</view>

			<view class="info-row">
				<uni-icons type="clock" size="18" color="#666"></uni-icons>
				<text class="info-text">{{ scenicData.openTime }}</text>
			</view>

			<view class="info-row">
				<uni-icons type="money" size="18" color="#666"></uni-icons>
				<text class="info-text">{{ scenicData.ticketPrice }}</text>
			</view>
		</view>

		<!-- 景点介绍 -->
		<view class="section">
			<view class="section-title">
				<text>景点介绍</text>
			</view>
			<view class="section-content">
				<text class="description">{{ scenicData.description }}</text>
			</view>
		</view>

		<!-- 用户评价 -->
		<view class="section">
			<view class="section-title">
				<text>用户评价</text>
			</view>

			<!-- 评价列表 -->
			<view class="review-list">
				<view class="review-item" v-for="(review, index) in scenicData.reviews" :key="index">
					<image class="user-avatar" :src="review.avatar" mode="aspectFill" />
					<view class="review-content">
						<view class="user-info">
							<text class="username">{{ review.username }}</text>
						</view>
						<text class="review-text">{{ review.content }}</text>
						<text class="review-time">{{ formatTime(review.time) }}</text>

						<!-- 评论图片 -->
						<view class="review-images" v-if="review.images.length > 0">
							<image 
								v-for="(img, imgIndex) in review.images" 
								:key="imgIndex"
								class="review-image"
								:src="img"
								mode="aspectFill"
								@click="previewImage(review.images, imgIndex)"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="action-bar">
			<button class="action-btn review-btn" @click="navigateToReview">
			    <uni-icons type="compose" size="20" color="#fff"></uni-icons>
			    <text>写评价</text>
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { http, ENV_CONFIG } from '@/api/http';

const scenicId = ref(null);
const scenicData = ref({
  images: [],
  reviews: []
});
const isCollected = ref(false);
const newReview = ref({
  content: '',
  images: []
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 格式化时间显示
const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 图片预览
const previewImage = (urls, index) => {
  uni.previewImage({
    current: index,
    urls: urls
  });
};

// 加载景点详情
const fetchDetail = async () => {
  try {
    const response = await http.get(`/api/scenic-spots/${scenicId.value}`);
    const data = response.data;

    // 处理评论数据
    const parseReviews = (reviews) => {
      return reviews.map(review => ({
        ...review,
        avatar: processImages([review.avatar])[0] || '/static/default-avatar.png', // 处理头像
        images: processImages(review.images || []) // 处理评论图片
      }));
    };
	// 处理图片路径（假设后端已返回数组）
    const processImages = (images) => {
      return (Array.isArray(images) ? images : []).map(img => {
        if (!img) return '/static/default-scenic.jpg';
        // 判断是否是完整URL
        if (img.startsWith('http') || img.startsWith('https')) {
          return img;
        }
        // 拼接环境变量中的基地址
        return `${ENV_CONFIG[process.env.NODE_ENV]}${img}`;
      });
    };
    scenicData.value = {
      ...data,
      images: processImages(data.images),
      reviews: parseReviews(data.reviews)
    };

  } catch (error) {
    uni.showToast({ title: '数据加载失败', icon: 'none' });
  }
};
const navigateToReview = () => {
  uni.navigateTo({
    url: `/pages/review/review?id=${scenicId.value}`
  });
};
onMounted(() => {
  uni.$on('review-submitted', fetchDetail);
});


onLoad((options) => {
  scenicId.value = options.id;
  fetchDetail();
});
onUnload(() => {
  uni.$off('review-submitted');
});
</script>

<style lang="scss">
.scenic-detail-container {
  padding-bottom: 100rpx;
  background-color: #f5f5f5;

  .image-swiper {
    width: 100%;
    height: 500rpx;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }

  .basic-info {
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

    .title-section {
      margin-bottom: 30rpx;

      .scenic-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .info-text {
        font-size: 28rpx;
        color: #666;
        margin-left: 10rpx;
      }
    }
  }

  .section {
    background-color: #fff;
    margin-bottom: 20rpx;
    padding: 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 30rpx;
    }

    .section-content {
      .description {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }

    .review-list {
      .review-item {
        display: flex;
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        .user-avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .review-content {
          flex: 1;

          .user-info {
            margin-bottom: 15rpx;

            .username {
              font-size: 28rpx;
              color: #333;
              margin-right: 15rpx;
            }
          }

          .review-text {
            font-size: 28rpx;
            color: #333;
            line-height: 1.5;
            margin-bottom: 15rpx;
          }

          .review-time {
            font-size: 24rpx;
            color: #999;
            display: block;
            margin-bottom: 15rpx;
          }

          .review-images {
            display: flex;
            flex-wrap: wrap;

            .review-image {
              width: 200rpx;
              height: 200rpx;
              border-radius: 8rpx;
              margin-right: 15rpx;
              margin-bottom: 15rpx;
            }
          }
        }
      }
    }
  }

  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .action-btn {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      font-size: 28rpx;
      border-radius: 0;
      border: none;

      &.collect-btn {
        background-color: #fff;
        color: #666;
      }

      &.review-btn {
        background-color: #2867CE;
        color: #fff;
        margin: 0 20rpx;
        border-radius: 40rpx;
      }
    }
  }

  .review-modal {
    background-color: #fff;
    padding: 30rpx;
    border-radius: 20rpx 20rpx 0 0;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      .modal-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .review-textarea {
      width: 100%;
      min-height: 200rpx;
      padding: 20rpx;
      background-color: #f5f5f5;
      border-radius: 12rpx;
      font-size: 28rpx;
      margin-bottom: 30rpx;
    }

    .submit-btn {
      background-color: #007aff;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 30rpx;
    }
  }
}
</style>