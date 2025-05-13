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
export default {
  data() {
    return {
      latitude: 39.90469, // 默认北京中心坐标
      longitude: 116.40717,
      markers: [],
      polyline: [],
      drawerVisible: false,
      drawerTitle: '',
      placeList: [],
      amapPlugin: null
    }
  },
  onLoad() {
    this.initAMapSDK().then(() => {
      this.checkLocationAuth();
    });
  },
  methods: {
    // 初始化高德地图SDK
    initAMapSDK() {
      return new Promise((resolve) => {
        if (typeof AMapWX !== 'undefined') {
          this.amapPlugin = new AMapWX({
            key: '052b0297c58a04faf82b59834539a719' // 替换为你自己的高德key
          });
          resolve();
        } else {
          uni.showToast({
            title: '地图服务初始化失败',
            icon: 'none'
          });
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
            uni.openSetting();
          }
        }
      });
    },
    
    // 获取当前位置
    async getLocation() {
      try {
        uni.showLoading({ title: '定位中...', mask: true });
        
        const res = await uni.getLocation({
          type: 'gcj02',
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
      this.searchNearby('厕所', '050000');
    },
    
    // 搜索附近医疗点
    searchNearbyHospitals() {
      this.searchNearby('医院', '090000');
    },
    
    // 搜索附近地点
    searchNearby(keyword, types) {
      uni.showLoading({ title: '搜索中...' });
      
      this.amapPlugin.getPoiAround({
        location: `${this.longitude},${this.latitude}`,
        keywords: keyword,
        types: types,
        success: (data) => {
          uni.hideLoading();
          
          this.placeList = data.markers.map(item => ({
            id: item.id,
            name: item.name,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            distance: item.distance
          }));
          
          this.showPlaceMarkers(data.markers);
          this.drawerTitle = keyword === '厕所' ? '附近厕所' : '附近医疗点';
          this.drawerVisible = true;
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({
            title: '搜索失败',
            icon: 'none'
          });
          console.error('搜索失败:', err);
        }
      });
    },
    
    // 显示地点标记
    showPlaceMarkers(markers) {
      const placeMarkers = markers.map((item, index) => ({
        id: index + 1,
        latitude: item.latitude,
        longitude: item.longitude,
        iconPath: '/static/marker.png',
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