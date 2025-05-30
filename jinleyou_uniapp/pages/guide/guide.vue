<template>
  <view class="container">
    <!-- 地图组件 -->
    <map
      id="myMap"
      longitude="{{longitude}}"
      latitude="{{latitude}}"
      markers="{{markers}}"
      show-location
      style="width: 100%; height: 100vh;"
      bindmarkertap="onMarkerTap"
    ></map>
  
    <!-- 操作按钮 -->
    <view class="btn-group">
      <button class="location-btn" bindtap="moveToLocation">
        <image src="/images/location.png" class="icon"/>
      </button>
      
      <button class="search-btn" bindtap="showSearchPanel">
        <image src="/images/search.png" class="icon"/>
      </button>
    </view>
  
    <!-- 搜索面板 -->
    <view class="search-panel {{panelShow ? 'show' : ''}}">
      <view class="search-header">
        <input 
          placeholder="搜索应急地点" 
          bindinput="onSearchInput"
          value="{{searchKeyword}}"
        />
        <button bindtap="hideSearchPanel">取消</button>
      </view>
      
      <scroll-view scroll-y class="result-list">
        <view 
          wx:for="{{searchResults}}" 
          wx:key="id"
          class="result-item"
          bindtap="onResultTap"
          data-item="{{item}}"
        >
          <text class="title">{{item.title}}</text>
          <text class="address">{{item.address}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import QQMapWX from 'qqmap-wx-jssdk';

export default {
  data() {
    return {
      mapKey: '6P6BZ-O46CZ-7C3XU-7CDUI-TXUFT-ASFGC',
      latitude: 39.136803,
      longitude: 117.107382,
      markers: [],
      polyline: [],
      drawerVisible: false,
      drawerTitle: '',
      placeList: [],
      qqMap: null
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
          this.qqMap = new QQMapWX({ key: this.mapKey });
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
        this.getLocation();
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
            uni.navigateTo({
              url: '/pages/my/setting'
            });
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
      this.qqMap.search({
        keyword: '厕所',
        location: {
			 type: 'gcj02',
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
      this.qqMap.search({
        keyword: '医院',
        location: {
			 type: 'gcj02',
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
	searchNearbyToilets() {
	  console.log('当前密钥:', this.mapKey)
	  console.log('搜索坐标:', this.latitude, this.longitude)
	  
	  this.qqMap.search({
	    keyword: '厕所',
	    location: { latitude: this.latitude, longitude: this.longitude },
	    success: (res) => {
	      console.log('原始响应:', JSON.parse(JSON.stringify(res)))
	    },
	    fail: (err) => {
	      console.error('完整错误对象:', err)
	      uni.showToast({ 
	        title: `错误码: ${err.status} 信息: ${err.message}`,
	        icon: 'none'
	      })
	    }
	  })
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