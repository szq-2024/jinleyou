<template>
  <view class="guide-page">
    <!-- 顶部导航栏 -->
    <uni-nav-bar 
      title="应急导航" 
      :border="false" 
      fixed
    />
    
    <!-- 地图容器 -->
    <map 
      id="emergencyMap"
      class="map-container"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :polyline="polyline"
      show-location
      @markertap="handleMarkerTap"
    ></map>
    
    <!-- 功能按钮组 -->
    <view class="action-buttons">
      <button class="locate-btn" @click="getLocation">
        <uni-icons type="location-filled" size="20" color="#fff" />
      </button>
      
      <button class="toilet-btn" @click="searchNearbyToilets">
        <uni-icons type="staff" size="20" color="#fff" />
        <text>附近厕所</text>
      </button>
      
      <button class="hospital-btn" @click="searchNearbyHospitals">
        <uni-icons type="medal" size="20" color="#fff" />
        <text>医疗点</text>
      </button>
    </view>
    
    <!-- 地点列表抽屉 -->
    <uni-drawer 
      :visible="drawerVisible" 
      mode="right" 
      @close="closeDrawer"
    >
      <view class="drawer-content">
        <view class="drawer-header">
          <text class="title">{{ drawerTitle }}</text>
          <uni-icons 
            type="close" 
            size="24" 
            color="#999" 
            @click="closeDrawer"
          />
        </view>
        
        <scroll-view scroll-y class="place-list">
          <view 
            v-for="(item, index) in placeList" 
            :key="index" 
            class="place-item"
            @click="navigateToPlace(item)"
          >
            <view class="place-info">
              <text class="name">{{ item.name }}</text>
              <text class="address">{{ item.address }}</text>
              <text class="distance">{{ item.distance }}米</text>
            </view>
            <uni-icons type="arrowright" size="18" color="#999" />
          </view>
          
          <view v-if="placeList.length === 0" class="empty-tip">
            附近没有找到相关地点
          </view>
        </scroll-view>
      </view>
    </uni-drawer>
  </view>
</template>

<script>
import QQMapWX from 'qqmap-wx-jssdk';

export default {
  data() {
      return {
		mapKeys: {
		    location: '6P6BZ-O46CZ-7C3XU-7CDUI-TXUFT-ASFGC',  // 定位专用
		    toilet: 'ZH7BZ-4P5KQ-MPQ5T-42FXT-MSBH6-XIFDE',      // 厕所搜索
		    hospital: 'VUABZ-5W7K7-SXUXE-HRZ3W-QKU3T-WZFRG'  // 医院搜索
		},
        latitude: 39.136803,
        longitude: 117.107382,
        markers: [],
        polyline: [],
        drawerVisible: false,
        drawerTitle: '',
        placeList: [],
        qqMap: null,
        currentCategory: '' // 新增当前分类标识
      }
    },
	onLoad() {
	    this.initQqMapSDK()
	      .then(() => this.checkLocationAuth())
	      .catch(err => {
	        console.error('初始化失败:', err);
	        uni.showModal({
	          title: '地图服务异常',
	          content: '无法加载地图功能，请检查网络或重启应用',
	          showCancel: false
	        });
	      });
	  },
	methods: {
		// 初始化腾讯地图SDK
		initQqMapSDK() {
		      return new Promise((resolve, reject) => {
		        try {
		          this.qqMap = new QQMapWX({
		            key: '6P6BZ-O46CZ-7C3XU-7CDUI-TXUFT-ASFGC' // 请替换为实际key
		          });
		          console.log('腾讯地图初始化成功');
		          resolve();
		        } catch (e) {
		          console.error('腾讯地图初始化失败:', e);
		          reject(e);
		        }
		      });
		},
    
    // 检查定位权限
    async checkLocationAuth() {
      try {
        const res = await uni.getSetting();
        if (!res.authSetting['scope.userLocation']) {
          this.openSetting();
        } else {
          this.getLocation();
        }
      } catch (error) {
        console.error('检查权限异常:', error);
        this.getLocation(); // 降级处理
      }
    },
    
    // 打开设置页
    openSetting() {
      uni.showModal({
        title: '提示',
        content: '需要您授权位置权限才能使用导航功能',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            // 跳转到应用内设置页面
            uni.navigateTo({
              url: '/pages/my/setting' // 确保路径正确
            });
          }
        }
      });
    },
    
    // 获取当前位置
    async getLocation() {
          try {
            uni.showLoading({ title: '定位中...', mask: true });
            const locationMap = new QQMapWX({ key: this.mapKeys.location });
            const res = await uni.getLocation({
              type: 'gcj02', // 腾讯地图使用GCJ-02坐标系
              isHighAccuracy: true
            });
            
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            this.addMyLocationMarker();
            
          } catch (err) {
            console.error('定位失败:', err);
            uni.showToast({
              title: '定位失败，已使用默认位置',
              icon: 'none'
            });
          } finally {
            uni.hideLoading();
          }
    },
    
    // 添加当前位置标记
    addMyLocationMarker() {
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        iconPath: '/static/location.png',
        width: 30,
        height: 30,
        title: '我的位置',
        zIndex: 99
      }];
    },
    
    // 搜索附近厕所
    searchNearbyToilets() {
      const toiletMap = new QQMapWX({ key: this.mapKeys.toilet });
      toiletMap.search({
        keyword: '厕所',
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        success: (res) => {
          this.processSearchResult(res.data, 'toilet');
          this.drawerTitle = '附近厕所';
          this.drawerVisible = true;
        },
        fail: (err) => {
          console.error('厕所搜索失败:', err);
          uni.showToast({ title: '搜索失败', icon: 'none' });
        }
      });
    },

    
    // 搜索附近医疗点
    searchNearbyHospitals() {
      const hospitalMap = new QQMapWX({ key: this.mapKeys.hospital });
      hospitalMap.search({
        keyword: '医院',
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        success: (res) => {
          this.processSearchResult(res.data, 'hospital');
          this.drawerTitle = '附近医疗点';
          this.drawerVisible = true;
        },
        fail: (err) => {
          console.error('医院搜索失败:', err);
          uni.showToast({ title: '搜索失败', icon: 'none' });
        }
      });
    },
	 // 处理搜索结果
	processSearchResult(data, category) {
	  this.placeList = data.map(item => ({
	    id: item.id,
	    name: item.title,
	    address: item.address,
	    latitude: item.location.lat,
	    longitude: item.location.lng,
	    distance: item._distance || '未知'
	  }));
	  this.showPlaceMarkers(category);
	},
    // 显示地点标记
    showPlaceMarkers(category) {
        const iconPath = category === 'hospital' 
          ? '/static/hospital-marker.png' 
          : '/static/marker.png';
        
        const placeMarkers = this.placeList.map((item, index) => ({
          id: index + 1,
          latitude: item.latitude,
          longitude: item.longitude,
          iconPath: iconPath,
          width: 24,
          height: 24,
          title: item.name,
          zIndex: 9
        }));
        
        this.markers = [...this.markers, ...placeMarkers];
    },
    
    // 导航到指定地点
    navigateToPlace(place) {
      uni.openLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        name: place.name,
        fail: () => {
          uni.showToast({
            title: '请安装地图应用',
            icon: 'none'
          });
        }
      });
      this.closeDrawer();
    },
    
    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .map-container {
    flex: 1;
    width: 100%;
  }
  
  .action-buttons {
    position: fixed;
    bottom: 30px;
    right: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 99;
    
    button {
      margin-bottom: 10px;
      border-radius: 50px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      
      text {
        margin-left: 5px;
        font-size: 14px;
      }
    }
    
    .locate-btn {
      width: 40px;
      height: 40px;
      padding: 0;
      justify-content: center;
      background-color: #007aff;
    }
    
    .toilet-btn {
      background-color: #2867CE;
    }
    
    .hospital-btn {
      background-color: #dd524d;
    }
  }
  
  .drawer-content {
    width: 80vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .drawer-header {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      
      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    
    .place-list {
      flex: 1;
      
      .place-item {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        
        .place-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .name {
            font-size: 16px;
            margin-bottom: 5px;
          }
          
          .address {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
          }
          
          .distance {
            font-size: 12px;
            color: #999;
          }
        }
      }
      
      .empty-tip {
        padding: 20px;
        text-align: center;
        color: #999;
      }
    }
  }
}
</style>