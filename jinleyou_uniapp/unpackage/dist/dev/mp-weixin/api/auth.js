"use strict";
const common_vendor = require("../common/vendor.js");
const checkTokenExpiration = () => {
  const token = common_vendor.index.getStorageSync("token");
  if (!token)
    return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3)
      throw new Error("非法Token格式");
    let payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payloadBase64.length % 4) {
      payloadBase64 += "=";
    }
    const decodedStr = decodeBase64(payloadBase64);
    common_vendor.index.__f__("log", "at api/auth.js:23", "🔍 解码后的Payload字符串:", decodedStr);
    const decoded = JSON.parse(decodedStr);
    const bufferTime = 3e5;
    const isExpired = Date.now() >= decoded.exp * 1e3;
    return isExpired ? null : token;
  } catch (error) {
    common_vendor.index.__f__("error", "at api/auth.js:34", "🚨 Token解析异常", {
      token,
      error: error.message,
      stack: error.stack
    });
    common_vendor.index.removeStorageSync("token");
    return null;
  }
};
function decodeBase64(base64) {
  const bytes = common_vendor.index.base64ToArrayBuffer(base64);
  const byteArray = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return decodeURIComponent(escape(binary));
}
exports.checkTokenExpiration = checkTokenExpiration;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
