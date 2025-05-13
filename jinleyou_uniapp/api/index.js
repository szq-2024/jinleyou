// api/index.js
import request from '@/utils/request'

export default {
  // 用户相关
  user: {
    getBanner: () => request({ url: '/user/getBanner' }),
    getInfo: () => request({ url: '/user/info' })
  },
  
  // 行程相关
  trip: {
    getList: (params) => request({ url: '/trip/list', method: 'GET', data: params }),
    like: (tripId) => request({ url: '/trip/like', method: 'POST', data: { tripId } }),
    cancelLike: (tripId) => request({ url: '/trip/cancelLike', method: 'POST', data: { tripId } }),
    publish: (data) => request({ url: '/trip/publish', method: 'POST', data })
  },
  
  // 景点相关
  scenic: {
    getDetail: (id) => request({ url: `/scenic/${id}`, method: 'GET' }),
    getReviews: (id) => request({ url: `/scenic/${id}/reviews`, method: 'GET' })
  }
}