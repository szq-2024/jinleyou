"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      locationPermission: "unknown"
    };
  },
  onShow() {
    this.checkPermissionStatus();
  },
  methods: {
    async checkPermissionStatus() {
      try {
        const res = await common_vendor.index.getSetting();
        const status = res.authSetting["scope.userLocation"];
        this.locationPermission = status ? "authorized" : "denied";
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/setting.vue:63", "获取权限状态失败:", e);
        this.locationPermission = "unknown";
      }
    },
    async handleSwitchChange(e) {
      const isOn = e.detail.value;
      if (isOn) {
        try {
          await common_vendor.index.authorize({ scope: "scope.userLocation" });
          this.locationPermission = "authorized";
          common_vendor.index.showToast({ title: "定位权限已开启", icon: "success" });
        } catch (error) {
          common_vendor.index.showModal({
            title: "位置权限申请",
            content: "需要位置权限来提供应急导航服务，请前往设置开启",
            confirmText: "立即开启",
            success: async (res) => {
              if (res.confirm) {
                const { authSetting } = await common_vendor.index.openSetting();
                if (authSetting["scope.userLocation"]) {
                  this.locationPermission = "authorized";
                  common_vendor.index.showToast({ title: "权限已开启", icon: "success" });
                } else {
                  this.locationPermission = "denied";
                }
              }
            }
          });
        }
      } else {
        common_vendor.index.showModal({
          title: "关闭定位权限",
          content: "需要到系统设置中关闭定位权限，是否立即前往？",
          confirmText: "前往设置",
          success: async (res) => {
            if (res.confirm) {
              await common_vendor.index.openSetting();
              this.checkPermissionStatus();
            }
          }
        });
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    logout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出当前账号吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "arrowleft",
      size: "24",
      color: "#333"
    }),
    c: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#666"
    }),
    d: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/my/change_password")),
    f: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    g: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5fad43a3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/setting.js.map
