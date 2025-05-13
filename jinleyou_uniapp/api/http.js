//api/http.js
import { checkTokenExpiration } from './auth';

// 环境配置
export const ENV_CONFIG = { 
  development: 'http://localhost:3000',
  production: 'https://apifoxmock.com/m1/4728220-0-default'
}

// 全局配置
const GLOBAL_CONFIG = {
	timeout: 10000, // 10秒超时
	retryCount: 1, // 失败重试次数
}

/**
 * 增强型请求封装
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 
 */
// 修改默认导出为命名导出
export const http = {
  get: (url, options = {}) => enhancedHttp(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => enhancedHttp(url, { ...options, method: 'POST', data }),
  put: (url, data, options = {}) => enhancedHttp(url, { ...options, method: 'PUT', data }),
  delete: (url, options = {}) => enhancedHttp(url, { ...options, method: 'DELETE' })
}


export async function enhancedHttp(url, options = {}) {
  // 合并配置
	const mergedOptions = {
		method: 'GET',
		data: {},
		headers: {},
		...options
	}

	// 请求拦截器
	const { headers, shouldAuth = true } = await requestInterceptor()
  
	// 构造请求头
	const finalHeaders = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		...headers,
		...mergedOptions.headers
	}

	// Token处理
	if (shouldAuth) {
		let validToken = checkTokenExpiration()
		
		  // 自动刷新机制
		if (!validToken && shouldAuth) {
		    try {
				const newToken = await checkTokenExpiration()
				validToken = newToken
		    } catch (e) {
				console.error('Token刷新失败:', e)
		    }
		}
		if (validToken) {
			finalHeaders.Authorization = `Bearer ${validToken}`
		}
	}

	// 发起请求
	try {
		 // 🔴 新增请求开始日志（步骤3）
		    console.debug('[HTTP] 请求开始', {
		      timestamp: new Date().toISOString(),
		      url: ENV_CONFIG[process.env.NODE_ENV] + url,
		      method: mergedOptions.method,
		      data: mergedOptions.data,
		      headers: finalHeaders
		    });
		
		    const response = await requestWithRetry({
		      url: ENV_CONFIG[process.env.NODE_ENV] + url,
		      data: mergedOptions.data,
		      method: mergedOptions.method,
		      header: finalHeaders,
		      timeout: GLOBAL_CONFIG.timeout
		    });
		
		    // 🔴 新增原始响应日志（步骤3）
		    console.debug('[HTTP] 原始响应', {
		      status: response.statusCode,
		      headers: response.header,
		      data: response.data
		    });
		
		    // 响应拦截器
		    return responseInterceptor(response);
		  } catch (error) {
		    // 🔴 新增错误详情日志（步骤3）
		    console.error('[HTTP] 请求失败', {
		      errorType: error.constructor.name,
		      message: error.message,
		      stack: error.stack,
		      retryCount: GLOBAL_CONFIG.retryCount,
		      url: ENV_CONFIG[process.env.NODE_ENV] + url
		    });
		    
		    errorHandler(error);
		    throw error;
		  }
}
const platformAdapter = {
  processResponse(res) {
    // 处理微信小程序返回值（返回数组）
    if (Array.isArray(res)) {
      const [error, successRes] = res;
      return error ? { error } : { response: successRes };
    }
    // 处理H5返回值（返回Promise）
    return { response: res };
  }
};
/**
 * 带重试机制的请求
 */
// 修正requestWithRetry函数
// http.js 修改后
async function requestWithRetry(params, retry = GLOBAL_CONFIG.retryCount) {
  for (let i = 0; i <= retry; i++) {
    try {
      const res = await uni.request(params);
      
      // 处理微信小程序的数组响应
      if (Array.isArray(res)) {
        const [error, successRes] = res;
        if (error) throw error;
        return {
          statusCode: successRes.statusCode,
          data: successRes.data,
          headers: successRes.header || {}
        };
      }
      
      // 处理其他平台的响应
      return {
        statusCode: res.statusCode || res.status,
        data: res.data,
        headers: res.header || res.headers || {}
      };
    } catch (error) {
      if (i === retry) {
        throw Object.assign(error, { 
          requestUrl: params.url,
          retryCount: i + 1 
        });
      }
    }
  }
  throw new Error(`请求失败: 超过最大重试次数 (${retry})`);
}

/**
 * 请求拦截器（可扩展）
 */
async function requestInterceptor() {
  // 可以在这里添加全局请求前逻辑
	return {
		headers: {},
		shouldAuth: true
	}
}

/**
 * 响应拦截器
 */
function responseInterceptor(response) {
  // 1. 基础对象校验
  if (!response || typeof response !== 'object') {
    throw new Error('响应对象格式错误: 非对象类型');
  }

  // 2. 关键字段校验
  const { statusCode, data } = response;
  if (typeof statusCode === 'undefined') {
    throw new Error('响应缺少状态码 (statusCode)');
  }
  if (typeof data === 'undefined') {
    throw new Error('响应缺少数据字段 (data)');
  }

  // 3. 状态码处理
  switch (true) {
    case statusCode === 401:
      uni.navigateTo({ url: '/pages/login' });
      throw new Error('登录状态已过期');
    case statusCode >= 500:
      throw new Error(`服务器错误 (${statusCode})`);
    case statusCode >= 400:
      throw new Error(`客户端错误 (${statusCode})`);
    case statusCode === 200:
      return data; // 正常返回数据
    default:
      throw new Error(`未知状态码: ${statusCode}`);
  }
}

/**
 * 统一错误处理
 */
function errorHandler(error) {
	console.error('请求错误:', error)
	uni.showToast({
		title: error.message || '网络请求失败',
		icon: 'none',
		duration: 2000
	})
}