"use strict";
const common_vendor = require("../common/vendor.js");
const baseURL = "http://localhost:3000/api";
function request(options) {
  const token = common_vendor.index.getStorageSync("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: baseURL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: { ...defaultHeaders, ...options.header || {} },
      success: (res) => {
        if (res.statusCode === 200) {
          const successCode = [200, 1];
          if (successCode.includes(res.data.code)) {
            resolve(res.data.data || res.data);
          } else {
            const errorMsg = res.data.msg || "请求失败";
            common_vendor.index.showToast({ title: errorMsg, icon: "none" });
            reject(new Error(errorMsg));
          }
        } else if (res.statusCode === 401) {
          common_vendor.index.navigateTo({ url: "/pages/auth/login" });
          reject(new Error("请重新登录"));
        } else {
          reject(new Error(`HTTP错误: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
        reject(err);
      }
    });
  });
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
