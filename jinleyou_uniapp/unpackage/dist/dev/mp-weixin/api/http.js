"use strict";
const common_vendor = require("../common/vendor.js");
const api_auth = require("./auth.js");
const ENV_CONFIG = {
  development: "http://localhost:3000",
  production: "https://apifoxmock.com/m1/4728220-0-default"
};
const GLOBAL_CONFIG = {
  timeout: 1e4,
  // 10秒超时
  retryCount: 1
  // 失败重试次数
};
const http = {
  get: (url, options = {}) => enhancedHttp(url, { ...options, method: "GET" }),
  post: (url, data, options = {}) => enhancedHttp(url, { ...options, method: "POST", data }),
  put: (url, data, options = {}) => enhancedHttp(url, { ...options, method: "PUT", data }),
  delete: (url, options = {}) => enhancedHttp(url, { ...options, method: "DELETE" })
};
async function enhancedHttp(url, options = {}) {
  const mergedOptions = {
    method: "GET",
    data: {},
    headers: {},
    ...options
  };
  const { headers, shouldAuth = true } = await requestInterceptor();
  const finalHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...headers,
    ...mergedOptions.headers
  };
  if (shouldAuth) {
    let validToken = api_auth.checkTokenExpiration();
    if (!validToken && shouldAuth) {
      try {
        const newToken = await api_auth.checkTokenExpiration();
        validToken = newToken;
      } catch (e) {
        common_vendor.index.__f__("error", "at api/http.js:61", "Token刷新失败:", e);
      }
    }
    if (validToken) {
      finalHeaders.Authorization = `Bearer ${validToken}`;
    }
  }
  try {
    common_vendor.index.__f__("debug", "at api/http.js:72", "[HTTP] 请求开始", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      url: ENV_CONFIG["development"] + url,
      method: mergedOptions.method,
      data: mergedOptions.data,
      headers: finalHeaders
    });
    const response = await requestWithRetry({
      url: ENV_CONFIG["development"] + url,
      data: mergedOptions.data,
      method: mergedOptions.method,
      header: finalHeaders,
      timeout: GLOBAL_CONFIG.timeout
    });
    common_vendor.index.__f__("debug", "at api/http.js:89", "[HTTP] 原始响应", {
      status: response.statusCode,
      headers: response.header,
      data: response.data
    });
    return responseInterceptor(response);
  } catch (error) {
    common_vendor.index.__f__("error", "at api/http.js:99", "[HTTP] 请求失败", {
      errorType: error.constructor.name,
      message: error.message,
      stack: error.stack,
      retryCount: GLOBAL_CONFIG.retryCount,
      url: ENV_CONFIG["development"] + url
    });
    errorHandler(error);
    throw error;
  }
}
async function requestWithRetry(params, retry = GLOBAL_CONFIG.retryCount) {
  for (let i = 0; i <= retry; i++) {
    try {
      const response = await common_vendor.index.request(params);
      if (Array.isArray(response)) {
        const [error, res] = response;
        if (error)
          throw error;
        return {
          statusCode: res.statusCode,
          data: res.data,
          headers: res.header
        };
      }
      return {
        statusCode: response.statusCode || 200,
        data: response.data,
        headers: response.headers || {}
      };
    } catch (error) {
      if (i === retry)
        throw error;
    }
  }
}
async function requestInterceptor() {
  return {
    headers: {},
    shouldAuth: true
  };
}
function responseInterceptor(response) {
  if (!response || typeof response !== "object") {
    throw new Error("响应对象格式错误: 非对象类型");
  }
  const { statusCode, data } = response;
  if (typeof statusCode === "undefined") {
    throw new Error("响应缺少状态码 (statusCode)");
  }
  if (typeof data === "undefined") {
    throw new Error("响应缺少数据字段 (data)");
  }
  switch (true) {
    case statusCode === 401:
      common_vendor.index.navigateTo({ url: "/pages/login" });
      throw new Error("登录状态已过期");
    case statusCode >= 500:
      throw new Error(`服务器错误 (${statusCode})`);
    case statusCode >= 400:
      throw new Error(`客户端错误 (${statusCode})`);
    case statusCode === 200:
      return response.data;
    default:
      throw new Error(`未知状态码: ${statusCode}`);
  }
}
function errorHandler(error) {
  common_vendor.index.__f__("error", "at api/http.js:205", "请求错误:", error);
  common_vendor.index.showToast({
    title: error.message || "网络请求失败",
    icon: "none",
    duration: 2e3
  });
}
exports.ENV_CONFIG = ENV_CONFIG;
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
