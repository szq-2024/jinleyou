// utils/util.js

/**
 * 格式化时间为相对时间（如"刚刚"、"5分钟前"）
 * @param {String|Number} timeString - 时间字符串或时间戳
 * @returns {String} 格式化后的时间字符串
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // 处理时间戳和字符串两种情况
  const date = new Date(typeof timeString === 'number' ? timeString : timeString);
  const now = new Date();
  const diff = now - date;
  
  // 一分钟内
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 一小时内
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 今天内
  if (date.toDateString() === now.toDateString()) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 今年内
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 格式化日期为YYYY-MM-DD格式
 * @param {String|Number} timestamp - 时间字符串或时间戳
 * @returns {String} 格式化后的日期字符串
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
};

/**
 * 格式化时间为YYYY-MM-DD HH:mm格式
 * @param {String|Number} timestamp - 时间字符串或时间戳
 * @returns {String} 格式化后的时间字符串
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp);
  return `${formatDate(timestamp)} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
};

/**
 * 补零函数
 * @param {Number} num - 需要补零的数字
 * @returns {String} 补零后的字符串
 */
const padZero = (num) => {
  return num < 10 ? `0${num}` : num.toString();
};

/**
 * 计算日期差（天数）
 * @param {String|Number} startTime - 开始时间
 * @param {String|Number} endTime - 结束时间
 * @returns {Number} 相差天数
 */
export const dateDiff = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

export default {
  formatTime,
  formatDate,
  formatDateTime,
  dateDiff
};