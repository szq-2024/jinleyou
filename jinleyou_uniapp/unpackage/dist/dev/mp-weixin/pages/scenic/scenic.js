"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_scenic = require("../../utils/scenic.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_nav_bar2 + _easycom_uni_rate2 + _easycom_uni_icons2 + _easycom_uni_file_picker2 + _easycom_uni_popup2)();
}
const _easycom_uni_nav_bar = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_rate = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-rate/uni-rate.js";
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _easycom_uni_file_picker = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_rate + _easycom_uni_icons + _easycom_uni_file_picker + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "scenic",
  setup(__props) {
    const scenicData = common_vendor.ref({
      id: "",
      name: "加载中...",
      rating: 0,
      reviewCount: 0,
      // 添加缺失字段
      address: "",
      openTime: "",
      ticketPrice: "",
      description: "",
      images: [],
      ratingDistribution: [0, 0, 0, 0, 0],
      reviews: []
      // 确保所有模板用到的字段都有初始值
    });
    common_vendor.onLoad(async (options) => {
      try {
        const res = await utils_scenic.fetchScenicData(options.id);
        scenicData.value = {
          // 默认值
          rating: 0,
          reviewCount: 0,
          images: [],
          ratingDistribution: [0, 0, 0, 0, 0],
          reviews: [],
          // API数据（覆盖默认值）
          ...res.data,
          // 确保数组字段存在
          images: res.data.images || [],
          reviews: res.data.reviews || [],
          ratingDistribution: res.data.ratingDistribution || [0, 0, 0, 0, 0]
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/scenic/scenic.vue:208", "加载失败:", error);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(_ctx.goBack),
        b: common_vendor.p({
          title: "景点详情",
          ["left-icon"]: "back",
          border: false
        }),
        c: common_vendor.f(scenicData.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index
          };
        }),
        d: common_vendor.t(scenicData.value.name),
        e: common_vendor.p({
          value: scenicData.value.rating,
          size: "18",
          readonly: true,
          color: "#ffca3e"
        }),
        f: common_vendor.t((scenicData.value.rating || 0).toFixed(1)),
        g: common_vendor.t(scenicData.value.reviewCount),
        h: common_vendor.p({
          type: "location-filled",
          size: "18",
          color: "#666"
        }),
        i: common_vendor.t(scenicData.value.address),
        j: common_vendor.p({
          type: "clock",
          size: "18",
          color: "#666"
        }),
        k: common_vendor.t(scenicData.value.openTime),
        l: common_vendor.p({
          type: "money",
          size: "18",
          color: "#666"
        }),
        m: common_vendor.t(scenicData.value.ticketPrice),
        n: common_vendor.t(scenicData.value.description),
        o: common_vendor.t(scenicData.value.reviewCount),
        p: common_vendor.o((...args) => _ctx.viewAllReviews && _ctx.viewAllReviews(...args)),
        q: common_vendor.t((scenicData.value.rating || 0).toFixed(1)),
        r: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: common_vendor.t(6 - i),
            b: scenicData.value.ratingDistribution[5 - i] / scenicData.value.reviewCount * 100,
            c: common_vendor.t(scenicData.value.ratingDistribution[5 - i]),
            d: i
          };
        }),
        s: common_vendor.f(scenicData.value.reviews, (review, index, i0) => {
          return common_vendor.e({
            a: review.avatar,
            b: common_vendor.t(review.username),
            c: "82759d36-5-" + i0,
            d: common_vendor.p({
              value: review.rating,
              size: "12",
              readonly: true,
              color: "#ffca3e"
            }),
            e: common_vendor.t(review.content),
            f: common_vendor.t(_ctx.formatTime(review.time)),
            g: review.images.length > 0
          }, review.images.length > 0 ? {
            h: common_vendor.f(review.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => _ctx.previewImage(review.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            i: index
          });
        }),
        t: common_vendor.p({
          type: _ctx.isCollected ? "heart-filled" : "heart",
          size: "20",
          color: _ctx.isCollected ? "#ff5a5f" : "#666"
        }),
        v: common_vendor.t(_ctx.isCollected ? "已收藏" : "收藏"),
        w: common_vendor.o((...args) => _ctx.toggleCollect && _ctx.toggleCollect(...args)),
        x: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#fff"
        }),
        y: common_vendor.o((...args) => _ctx.showReviewModal && _ctx.showReviewModal(...args)),
        z: common_vendor.o(_ctx.closeReviewModal),
        A: common_vendor.p({
          type: "closeempty",
          size: "20"
        }),
        B: common_vendor.o(($event) => _ctx.newReview.rating = $event),
        C: common_vendor.p({
          size: "24",
          color: "#ffca3e",
          modelValue: _ctx.newReview.rating
        }),
        D: _ctx.newReview.content,
        E: common_vendor.o(($event) => _ctx.newReview.content = $event.detail.value),
        F: common_vendor.o(($event) => _ctx.newReview.images = $event),
        G: common_vendor.p({
          fileMediatype: "image",
          mode: "grid",
          limit: "9",
          modelValue: _ctx.newReview.images
        }),
        H: common_vendor.o((...args) => _ctx.submitReview && _ctx.submitReview(...args)),
        I: common_vendor.sr("reviewPopup", "82759d36-8"),
        J: common_vendor.p({
          type: "bottom"
        }),
        K: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scenic/scenic.js.map
