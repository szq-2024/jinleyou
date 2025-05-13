// api/index.js
import request from './request'

export default {
  // 获取行程列表
  getTripList(params) {
    return request({
      url: '/trip/list',
      method: 'GET',
      data: params
    })
  },
  
  // 点赞行程
  likeTrip(tripId) {
    return request({
      url: '/trip/like',
      method: 'POST',
      data: { tripId }
    })
  },
  
  // 取消点赞
  cancelLikeTrip(tripId) {
    return request({
      url: '/trip/cancelLike',
      method: 'POST',
      data: { tripId }
    })
  },
  
  // 发布行程
  publishTrip(data) {
    return request({
      url: '/trip/publish',
      method: 'POST',
      data
    })
  },
  
  // 其他API...
}