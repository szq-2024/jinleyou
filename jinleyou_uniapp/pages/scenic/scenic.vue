<template>
	<view class="scenic-detail-container">
		<!-- 头部导航 -->
		<uni-nav-bar 
			title="景点详情" 
			left-icon="back" 
			@clickLeft="goBack"
			:border="false"
		/>
    
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
				<view class="rating-section">
					<uni-rate 
						:value="scenicData.rating" 
						size="18" 
						readonly 
						color="#ffca3e"
					/>
					<text class="rating-text">{{ (scenicData.rating || 0).toFixed(1) }}</text>
					<text class="review-count">{{ scenicData.reviewCount }}条评价</text>
				</view>
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
				<text class="all-reviews" @click="viewAllReviews">查看全部({{ scenicData.reviewCount }})</text>
			</view>
      
			<!-- 评分统计 -->
			<view class="rating-stat">
				<text class="total-rating">{{ (scenicData.rating || 0).toFixed(1) }}</text>
				<view class="rating-detail">
					<view class="rate-bar" v-for="i in 5" :key="i">
						<text class="rate-star">{{ 6 - i }}星</text>
						<progress 
							:percent="(scenicData.ratingDistribution[5-i]/scenicData.reviewCount)*100" 
							activeColor="#ffca3e"
							backgroundColor="#eee"
							stroke-width="6"
						/>
						<text class="rate-count">{{ scenicData.ratingDistribution[5-i] }}</text>
					</view>
				</view>
			</view>
      
			<!-- 评价列表 -->
			<view class="review-list">
				<view class="review-item" v-for="(review, index) in scenicData.reviews" :key="index">
					<image class="user-avatar" :src="review.avatar" mode="aspectFill" />
					<view class="review-content">
						<view class="user-info">
							<text class="username">{{ review.username }}</text>
							<uni-rate 
								:value="review.rating" 
								size="12" 
								readonly 
								color="#ffca3e"
							/>
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
			<button class="action-btn collect-btn" @click="toggleCollect">
				<uni-icons 
					:type="isCollected ? 'heart-filled' : 'heart'" 
					size="20" 
					:color="isCollected ? '#ff5a5f' : '#666'"
				></uni-icons>
				<text>{{ isCollected ? '已收藏' : '收藏' }}</text>
			</button>
			<button class="action-btn review-btn" @click="showReviewModal">
				<uni-icons type="compose" size="20" color="#fff"></uni-icons>
				<text>写评价</text>
			</button>
		</view>
    
		<!-- 评价弹窗 -->
		<uni-popup ref="reviewPopup" type="bottom">
			<view class="review-modal">
				<view class="modal-header">
					<text class="modal-title">发表评价</text>
					<uni-icons type="closeempty" size="20" @click="closeReviewModal"></uni-icons>
				</view>
				<view class="rating-selector">
					<text class="rating-label">评分：</text>
					<uni-rate v-model="newReview.rating" size="24" color="#ffca3e"></uni-rate>
				</view>
				<textarea 
					v-model="newReview.content" 
					class="review-textarea" 
					placeholder="写下你的真实体验..."
					maxlength="200"
					auto-height
				/>
				<view class="image-uploader">
					<uni-file-picker 
						v-model="newReview.images"
						fileMediatype="image"
						mode="grid"
						limit="9"
					/>
				</view>
				<button class="submit-btn" @click="submitReview">提交评价</button>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
// 从正确的位置导入
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchScenicData } from '@/utils/scenic.js'

// 景点数据（使用ref包装）
const scenicData = ref({
	id: '',
	name: '加载中...',
	rating: 0,
	reviewCount: 0,  // 添加缺失字段
	address: '',
	openTime: '',
	ticketPrice: '',
	description: '',
	images: [],
	ratingDistribution: [0, 0, 0, 0, 0],
	reviews: []  // 确保所有模板用到的字段都有初始值
})

onLoad(async (options) => {
	try {
		const res = await fetchScenicData(options.id)
    
		scenicData.value = {
			// 默认值
			rating: 0,
			reviewCount: 0,
			images: [],
			ratingDistribution: [0, 0, 0, 0, 0],
			reviews: [],
      
			// API数据（覆盖默认值）
			...res.data,
      
			// 确保数组字段存在
			images: res.data.images || [],
			reviews: res.data.reviews || [],
			ratingDistribution: res.data.ratingDistribution || [0, 0, 0, 0, 0]
		}
    
	} catch (error) {
		console.error('加载失败:', error)
		// 保留默认值
	}
})
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
      
			.rating-section {
				display: flex;
				align-items: center;
        
				.rating-text {
					font-size: 28rpx;
					color: #ff9500;
					margin: 0 10rpx 0 5rpx;
				}
        
				.review-count {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
    
		.info-row {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
      
			&:last-child {
				margin-bottom: 0;
			}
      
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
      
			.all-reviews {
				font-size: 26rpx;
				color: #007aff;
				font-weight: normal;
			}
		}
    
		.section-content {
			.description {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}
    
		.rating-stat {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			margin-bottom: 30rpx;
			border-bottom: 1rpx solid #eee;
      
			.total-rating {
				font-size: 60rpx;
				font-weight: bold;
				color: #ff9500;
				margin-right: 40rpx;
				width: 120rpx;
				text-align: center;
			}
      
			.rating-detail {
				flex: 1;
        
				.rate-bar {
					display: flex;
					align-items: center;
					margin-bottom: 15rpx;
          
					&:last-child {
						margin-bottom: 0;
					}
          
					.rate-star {
						font-size: 24rpx;
						color: #666;
						width: 70rpx;
					}
          
					progress {
						flex: 1;
						margin: 0 15rpx;
					}
          
					.rate-count {
						font-size: 24rpx;
						color: #999;
						width: 60rpx;
						text-align: right;
					}
				}
			}
		}
    
		.review-list {
			.review-item {
				display: flex;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
        
				&:last-child {
				border-bottom: none;
				}
        
				.user-avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
        
				.review-content {
					flex: 1;
          
					.user-info {
						display: flex;
						align-items: center;
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
				background-color: #007aff;
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
    
		.rating-selector {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
      
			.rating-label {
				font-size: 28rpx;
				color: #666;
				margin-right: 20rpx;
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
    
		.image-uploader {
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