"use strict";
const formatTime = (timeString) => {
  if (!timeString)
    return "";
  const date = new Date(typeof timeString === "number" ? timeString : timeString);
  const now = /* @__PURE__ */ new Date();
  const diff = now - date;
  if (diff < 60 * 1e3) {
    return "刚刚";
  }
  if (diff < 60 * 60 * 1e3) {
    return `${Math.floor(diff / (60 * 1e3))}分钟前`;
  }
  if (date.toDateString() === now.toDateString()) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
exports.formatTime = formatTime;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/util.js.map
