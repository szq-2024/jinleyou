"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const _sfc_main = {
  data() {
    return {
      isLoading: false,
      unreadCount: 0,
      pollInterval: null
    };
  },
  computed: {
    ...common_vendor.mapState("user", ["info"]),
    userInfo() {
      return this.info || {};
    }
  },
  onLoad() {
    this.getUserInfo();
  },
  onShow() {
    this.getUserInfo();
    this.fetchUnreadCount();
    this.startPolling();
  },
  onHide() {
    clearInterval(this.pollInterval);
  },
  onUnload() {
    clearInterval(this.pollInterval);
  },
  methods: {
    ...common_vendor.mapMutations("user", ["SET_INFO", "CLEAR_ALL"]),
    checkTokenExpiration() {
      const token = common_vendor.index.getStorageSync("token");
      const expireTime = common_vendor.index.getStorageSync("tokenExpire");
      common_vendor.index.__f__("debug", "at pages/my/my.vue:107", "Token验证:", {
        tokenExists: !!token,
        expireTime: new Date(expireTime * 1e3).toLocaleString(),
        currentTime: (/* @__PURE__ */ new Date()).toLocaleString()
      });
      if (!token || Date.now() > expireTime) {
        this.CLEAR_ALL();
        return false;
      }
      return true;
    },
    // 获取未读消息数量
    async fetchUnreadCount() {
      try {
        const res = await api_http.http.get("/api/chat/unread-count");
        common_vendor.index.__f__("log", "at pages/my/my.vue:123", "未读消息响应:", res);
        if (res.code === 200 && typeof res.data === "number") {
          this.unreadCount = res.data;
        } else {
          this.unreadCount = 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:131", "获取未读消息失败:", error);
        this.unreadCount = 0;
      }
    },
    // 启动轮询
    startPolling() {
      this.pollInterval = setInterval(() => {
        this.fetchUnreadCount();
      }, 5e3);
      common_vendor.index.__f__("log", "at pages/my/my.vue:141", "开始轮询未读消息...");
    },
    // 获取用户信息
    // 修改后的getUserInfo方法
    async getUserInfo() {
      this.isLoading = true;
      try {
        const res = await api_http.http.get("/api/user/info");
        if (res.code === 200) {
          const userData = {
            nickname: res.data.nickname,
            avatar: res.data.avatar,
            // 使用后端返回的完整URL
            gender: res.data.gender,
            bio: res.data.bio
          };
          this.SET_INFO(userData);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:159", "用户信息获取失败:", err);
      } finally {
        this.isLoading = false;
      }
    },
    // 处理导航跳转
    handleNavigate(url) {
      const checkToken = this.checkTokenExpiration();
      if (!checkToken) {
        common_vendor.index.showModal({
          // 使用 uni.showModal
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          }
        });
        return;
      }
      if (!this.userInfo || Object.keys(this.userInfo).length === 0) {
        this.getUserInfo();
      }
      const targetPath = url.replace("/pages/", "").replace(/\.html$/, "");
      const currentPath = getCurrentPages().pop().route;
      if (currentPath !== targetPath) {
        common_vendor.index.navigateTo({ url });
      }
    },
    // 跳转编辑资料
    toEditProfile() {
      this.handleNavigate("/pages/my/edit_profile");
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
              url: "/pages/login/login"
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
  var _a;
  return common_vendor.e({
    a: $options.userInfo.avatar || "/static/default-avatar.png",
    b: common_vendor.t(((_a = $options.userInfo) == null ? void 0 : _a.nickname) || ($data.isLoading ? "加载中..." : "未设置昵称")),
    c: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    d: common_vendor.o((...args) => $options.toEditProfile && $options.toEditProfile(...args)),
    e: common_vendor.p({
      type: "heart-filled",
      size: "20",
      color: "#ff5a5f"
    }),
    f: $data.unreadCount > 0
  }, $data.unreadCount > 0 ? {
    g: common_vendor.t($data.unreadCount > 99 ? "99+" : $data.unreadCount)
  } : {}, {
    h: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    i: common_vendor.o(($event) => $options.handleNavigate("/pages/my/my_messages")),
    j: common_vendor.p({
      type: "chatboxes-filled",
      size: "20",
      color: "#007aff"
    }),
    k: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    l: common_vendor.o(($event) => $options.handleNavigate("/pages/my/my_review")),
    m: common_vendor.p({
      type: "calendar-filled",
      size: "20",
      color: "#4cd964"
    }),
    n: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    o: common_vendor.o(($event) => $options.handleNavigate("/pages/my/my_trips")),
    p: common_vendor.p({
      type: "star-filled",
      size: "20",
      color: "#8A2BE2"
    }),
    q: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    r: common_vendor.o(($event) => $options.handleNavigate("/pages/my/my_services")),
    s: common_vendor.p({
      type: "gear-filled",
      size: "20",
      color: "#808080"
    }),
    t: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    v: common_vendor.o(($event) => $options.handleNavigate("/pages/my/setting")),
    w: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    x: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
