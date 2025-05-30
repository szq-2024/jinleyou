"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_user = require("./modules/user.js");
const store = common_vendor.createStore({
  state: {
    userInfo: {}
    // 初始化为空对象
  },
  modules: {
    user: store_modules_user.user
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
