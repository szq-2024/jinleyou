"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 39.90469,
      // 默认北京中心坐标
      longitude: 116.40717,
      markers: [],
      polyline: [],
      drawerVisible: false,
      drawerTitle: "",
      placeList: [],
      amapPlugin: null
    };
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
        if (typeof AMapWX !== "undefined") {
          this.amapPlugin = new AMapWX({
            key: "052b0297c58a04faf82b59834539a719"
            // 替换为你自己的高德key
          });
          resolve();
        } else {
          common_vendor.index.showToast({
            title: "地图服务初始化失败",
            icon: "none"
          });
        }
      });
    },
    // 检查定位权限
    async checkLocationAuth() {
      try {
        const res = await common_vendor.index.getSetting();
        if (!res.authSetting["scope.userLocation"]) {
          this.openSetting();
        } else {
          this.getLocation();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/guide.vue:127", "检查权限异常:", error);
        this.getLocation();
      }
    },
    // 打开设置页
    openSetting() {
      common_vendor.index.showModal({
        title: "提示",
        content: "需要您授权位置权限才能使用导航功能",
        confirmText: "去设置",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.openSetting();
          }
        }
      });
    },
    // 获取当前位置
    async getLocation() {
      try {
        common_vendor.index.showLoading({ title: "定位中...", mask: true });
        const res = await common_vendor.index.getLocation({
          type: "gcj02",
          isHighAccuracy: true
        });
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.addMyLocationMarker();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/guide/guide.vue:161", "定位失败:", err);
        common_vendor.index.showToast({
          title: "定位失败，已使用默认位置",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 添加当前位置标记
    addMyLocationMarker() {
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        iconPath: "/static/location.png",
        width: 30,
        height: 30,
        title: "我的位置",
        zIndex: 99
      }];
    },
    // 搜索附近厕所
    searchNearbyToilets() {
      this.searchNearby("厕所", "050000");
    },
    // 搜索附近医疗点
    searchNearbyHospitals() {
      this.searchNearby("医院", "090000");
    },
    // 搜索附近地点
    searchNearby(keyword, types) {
      common_vendor.index.showLoading({ title: "搜索中..." });
      this.amapPlugin.getPoiAround({
        location: `${this.longitude},${this.latitude}`,
        keywords: keyword,
        types,
        success: (data) => {
          common_vendor.index.hideLoading();
          this.placeList = data.markers.map((item) => ({
            id: item.id,
            name: item.name,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            distance: item.distance
          }));
          this.showPlaceMarkers(data.markers);
          this.drawerTitle = keyword === "厕所" ? "附近厕所" : "附近医疗点";
          this.drawerVisible = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "搜索失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/guide/guide.vue:225", "搜索失败:", err);
        }
      });
    },
    // 显示地点标记
    showPlaceMarkers(markers) {
      const placeMarkers = markers.map((item, index) => ({
        id: index + 1,
        latitude: item.latitude,
        longitude: item.longitude,
        iconPath: "/static/marker.png",
        width: 24,
        height: 24,
        title: item.name,
        zIndex: 9
      }));
      this.markers = [...this.markers, ...placeMarkers];
    },
    // 导航到指定地点
    navigateToPlace(place) {
      common_vendor.index.openLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        name: place.name,
        fail: () => {
          common_vendor.index.showToast({
            title: "请安装地图应用",
            icon: "none"
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
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_drawer2 = common_vendor.resolveComponent("uni-drawer");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_drawer2)();
}
const _easycom_uni_nav_bar = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _easycom_uni_drawer = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_drawer)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "应急导航",
      border: false,
      fixed: true
    }),
    b: $data.latitude,
    c: $data.longitude,
    d: $data.markers,
    e: $data.polyline,
    f: common_vendor.o((...args) => _ctx.handleMarkerTap && _ctx.handleMarkerTap(...args)),
    g: common_vendor.p({
      type: "location-filled",
      size: "20",
      color: "#fff"
    }),
    h: common_vendor.o((...args) => $options.getLocation && $options.getLocation(...args)),
    i: common_vendor.p({
      type: "staff",
      size: "20",
      color: "#fff"
    }),
    j: common_vendor.o((...args) => $options.searchNearbyToilets && $options.searchNearbyToilets(...args)),
    k: common_vendor.p({
      type: "medal",
      size: "20",
      color: "#fff"
    }),
    l: common_vendor.o((...args) => $options.searchNearbyHospitals && $options.searchNearbyHospitals(...args)),
    m: common_vendor.t($data.drawerTitle),
    n: common_vendor.o($options.closeDrawer),
    o: common_vendor.p({
      type: "close",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.f($data.placeList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.address),
        c: common_vendor.t(item.distance),
        d: "04b95c5c-6-" + i0 + ",04b95c5c-4",
        e: index,
        f: common_vendor.o(($event) => $options.navigateToPlace(item), index)
      };
    }),
    q: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    r: $data.placeList.length === 0
  }, $data.placeList.length === 0 ? {} : {}, {
    s: common_vendor.o($options.closeDrawer),
    t: common_vendor.p({
      visible: $data.drawerVisible,
      mode: "right"
    }),
    v: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-04b95c5c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/guide.js.map
