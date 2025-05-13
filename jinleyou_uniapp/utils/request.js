// utils/request.js
const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : 'https://apifoxmock.com/m1/4728220-0-default/api'

export default function(options) {
  const token = uni.getStorageSync('token')
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: { ...defaultHeaders, ...(options.header || {}) },
      success: (res) => {
        // 统一处理HTTP状态码
        if (res.statusCode === 200) {
          // 兼容不同后端返回格式
          const successCode = [200, 1] // 可配置的成功状态码
          if (successCode.includes(res.data.code)) {
            resolve(res.data.data || res.data)
          } else {
            const errorMsg = res.data.msg || '请求失败'
            uni.showToast({ title: errorMsg, icon: 'none' })
            reject(new Error(errorMsg))
          }
        } else if (res.statusCode === 401) {
          uni.navigateTo({ url: '/pages/auth/login' })
          reject(new Error('请重新登录'))
        } else {
          reject(new Error(`HTTP错误: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}