// /api/scenic.js
import request from './request' // 假设你有一个请求封装

/**
 * 获取景点详情
 * @param {string} id - 景点ID
 * @returns {Promise}
 */
export const fetchScenicData = (id) => {
  return request({
    url: `/scenic/${id}`,
    method: 'GET'
  })
}

/**
 * 获取景点评价
 * @param {string} id - 景点ID
 * @returns {Promise}
 */
export const fetchScenicReviews = (id) => {
  return request({
    url: `/scenic/${id}/reviews`,
    method: 'GET'
  })
}