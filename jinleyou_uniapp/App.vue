<script>
// 新增导入语句
import { checkTokenExpiration } from '@/api/auth.js'; // 根据实际路径调整

export default {
  onLaunch: function() {
    console.log('App Launch')
    // 检查登录状态
    const token = uni.getStorageSync('token')
    
    if (token) {
      // 直接调用 Token 检查方法
      const validToken = checkTokenExpiration()
      if (!validToken) {
        uni.removeStorageSync('token')
        uni.reLaunch({ url: '/pages/login/login' })
      }
    } else {
      // 如果没有登录，跳转到登录页面
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>