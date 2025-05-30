"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const api_auth = require("./api/auth.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/register/index.js";
  "./pages/forgot-password/forgot-password.js";
  "./pages/index/index.js";
  "./pages/partner/index.js";
  "./pages/partner/create-plans.js";
  "./pages/partner/create-guides.js";
  "./pages/chat/chat.js";
  "./pages/my/my.js";
  "./pages/scenic/scenic.js";
  "./pages/review/review.js";
  "./pages/my/my_messages.js";
  "./pages/my/my_review.js";
  "./pages/my/my_trips.js";
  "./pages/my/my_services.js";
  "./pages/my/setting.js";
  "./pages/my/change_password.js";
  "./pages/my/edit_profile.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      const validToken = api_auth.checkTokenExpiration();
      if (!validToken) {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.reLaunch({ url: "/pages/login/login" });
      }
    } else {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:26", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:29", "App Hide");
  }
};
common_vendor.dayjs.extend(common_vendor.isSameOrAfter);
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
