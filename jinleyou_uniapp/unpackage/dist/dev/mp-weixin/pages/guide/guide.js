"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      mapKeys: {
        location: "6P6BZ-O46CZ-7C3XU-7CDUI-TXUFT-ASFGC",
        // 定位专用
        toilet: "ZH7BZ-4P5KQ-MPQ5T-42FXT-MSBH6-XIFDE",
        // 厕所搜索
        hospital: "VUABZ-5W7K7-SXUXE-HRZ3W-QKU3T-WZFRG"
        // 医院搜索
      },
      latitude: 39.136803,
      longitude: 117.107382,
      markers: [],
      polyline: [],
      drawerVisible: false,
      drawerTitle: "",
      placeList: [],
      qqMap: null,
      currentCategory: ""
      // 新增当前分类标识
    };
  },
  onLoad() {
    this.initQqMapSDK().then(() => this.checkLocationAuth()).catch((err) => {
      common_vendor.index.__f__("error", "at pages/guide/guide.vue:106", "初始化失败:", err);
      common_vendor.index.showModal({
        title: "地图服务异常",
        content: "无法加载地图功能，请检查网络或重启应用",
        showCancel: false
      });
    });
  },
  methods: {
    // 初始化腾讯地图SDK
    initQqMapSDK() {
      return new Promise((resolve, reject) => {
        try {
          this.qqMap = new common_vendor.QQMapWX({
            key: "6P6BZ-O46CZ-7C3XU-7CDUI-TXUFT-ASFGC"
            // 请替换为实际key
          });
          common_vendor.index.__f__("log", "at pages/guide/guide.vue:122", "腾讯地图初始化成功");
          resolve();
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/guide/guide.vue:125", "腾讯地图初始化失败:", e);
          reject(e);
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
        common_vendor.index.__f__("error", "at pages/guide/guide.vue:141", "检查权限异常:", error);
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
            common_vendor.index.navigateTo({
              url: "/pages/my/setting"
              // 确保路径正确
            });
          }
        }
      });
    },
    // 获取当前位置
    async getLocation() {
      try {
        common_vendor.index.showLoading({ title: "定位中...", mask: true });
        const locationMap = new common_vendor.QQMapWX({ key: this.mapKeys.location });
        const res = await common_vendor.index.getLocation({
          type: "gcj02",
          // 腾讯地图使用GCJ-02坐标系
          isHighAccuracy: true
        });
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.addMyLocationMarker();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/guide/guide.vue:178", "定位失败:", err);
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
      const toiletMap = new common_vendor.QQMapWX({ key: this.mapKeys.toilet });
      toiletMap.search({
        keyword: "厕所",
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        success: (res) => {
          this.processSearchResult(res.data, "toilet");
          this.drawerTitle = "附近厕所";
          this.drawerVisible = true;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/guide/guide.vue:217", "厕所搜索失败:", err);
          common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
        }
      });
    },
    // 搜索附近医疗点
    searchNearbyHospitals() {
      const hospitalMap = new common_vendor.QQMapWX({ key: this.mapKeys.hospital });
      hospitalMap.search({
        keyword: "医院",
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        success: (res) => {
          this.processSearchResult(res.data, "hospital");
          this.drawerTitle = "附近医疗点";
          this.drawerVisible = true;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/guide/guide.vue:239", "医院搜索失败:", err);
          common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
        }
      });
    },
    // 处理搜索结果
    processSearchResult(data, category) {
      this.placeList = data.map((item) => ({
        id: item.id,
        name: item.title,
        address: item.address,
        latitude: item.location.lat,
        longitude: item.location.lng,
        distance: item._distance || "未知"
      }));
      this.showPlaceMarkers(category);
    },
    // 显示地点标记
    showPlaceMarkers(category) {
      const iconPath = category === "hospital" ? "/static/hospital-marker.png" : "/static/marker.png";
      const placeMarkers = this.placeList.map((item, index) => ({
        id: index + 1,
        latitude: item.latitude,
        longitude: item.longitude,
        iconPath,
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
