"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      notificationEnabled: true,
      cacheSize: "12.5MB",
      appVersion: "1.0.0"
    };
  },
  onLoad() {
    this.getAppInfo();
  },
  methods: {
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 通用跳转方法
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    // 获取应用信息
    getAppInfo() {
      const accountInfo = common_vendor.index.getAccountInfoSync();
      this.appVersion = accountInfo.miniProgram.version || "1.0.0";
      this.cacheSize = this.calculateCacheSize();
    },
    // 计算缓存大小（模拟）
    calculateCacheSize() {
      const size = Math.random() * 10 + 5;
      return size.toFixed(1) + "MB";
    },
    // 切换通知设置
    toggleNotification(e) {
      this.notificationEnabled = e.detail.value;
      common_vendor.index.showToast({
        title: this.notificationEnabled ? "已开启通知" : "已关闭通知",
        icon: "none"
      });
    },
    // 检查更新
    checkUpdate() {
      common_vendor.index.showLoading({ title: "检查中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "提示",
          content: "当前已是最新版本",
          showCancel: false
        });
      }, 1e3);
    },
    // 显示用户协议
    showAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/webview?url=" + encodeURIComponent("https://yourdomain.com/agreement")
      });
    },
    // 显示隐私政策
    showPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/webview?url=" + encodeURIComponent("https://yourdomain.com/privacy")
      });
    },
    // 退出登录
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.redirectTo({
              url: "/pages/auth/login"
            });
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
      type: "person",
      size: "20",
      color: "#666"
    }),
    d: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/my/edit-profile")),
    f: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#666"
    }),
    g: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    h: common_vendor.o(($event) => $options.navigateTo("/pages/my/change-password")),
    i: common_vendor.p({
      type: "sound",
      size: "20",
      color: "#666"
    }),
    j: $data.notificationEnabled,
    k: common_vendor.o((...args) => $options.toggleNotification && $options.toggleNotification(...args)),
    l: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#666"
    }),
    m: common_vendor.t($data.cacheSize),
    n: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    o: common_vendor.o(($event) => $options.navigateTo("/pages/my/clear-cache")),
    p: common_vendor.p({
      type: "download",
      size: "20",
      color: "#666"
    }),
    q: common_vendor.t($data.appVersion),
    r: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    s: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    t: common_vendor.p({
      type: "info",
      size: "20",
      color: "#666"
    }),
    v: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    w: common_vendor.o(($event) => $options.navigateTo("/pages/my/about-us")),
    x: common_vendor.p({
      type: "paperclip",
      size: "20",
      color: "#666"
    }),
    y: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    z: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    A: common_vendor.p({
      type: "eye",
      size: "20",
      color: "#666"
    }),
    B: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#ccc"
    }),
    C: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    D: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    E: common_vendor.gei(_ctx, "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5fad43a3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/setting.js.map
