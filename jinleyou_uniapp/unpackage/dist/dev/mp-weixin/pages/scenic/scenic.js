"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "scenic",
  setup(__props) {
    const scenicId = common_vendor.ref(null);
    const scenicData = common_vendor.ref({
      images: [],
      reviews: []
    });
    common_vendor.ref(false);
    common_vendor.ref({
      content: "",
      images: []
    });
    const formatTime = (timeString) => {
      if (!timeString)
        return "";
      const date = new Date(timeString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    };
    const previewImage = (urls, index) => {
      common_vendor.index.previewImage({
        current: index,
        urls
      });
    };
    const fetchDetail = async () => {
      try {
        const response = await api_http.http.get(`/api/scenic-spots/${scenicId.value}`);
        const data = response.data;
        const parseReviews = (reviews) => {
          return reviews.map((review) => ({
            ...review,
            avatar: processImages([review.avatar])[0] || "/static/default-avatar.png",
            // 处理头像
            images: processImages(review.images || [])
            // 处理评论图片
          }));
        };
        const processImages = (images) => {
          return (Array.isArray(images) ? images : []).map((img) => {
            if (!img)
              return "/static/default-scenic.jpg";
            if (img.startsWith("http") || img.startsWith("https")) {
              return img;
            }
            return `${api_http.ENV_CONFIG["development"]}${img}`;
          });
        };
        scenicData.value = {
          ...data,
          images: processImages(data.images),
          reviews: parseReviews(data.reviews)
        };
      } catch (error) {
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
      }
    };
    const navigateToReview = () => {
      common_vendor.index.navigateTo({
        url: `/pages/review/review?id=${scenicId.value}`
      });
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on("review-submitted", fetchDetail);
    });
    common_vendor.onLoad((options) => {
      scenicId.value = options.id;
      fetchDetail();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("review-submitted");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(scenicData.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index
          };
        }),
        b: common_vendor.t(scenicData.value.name),
        c: common_vendor.p({
          type: "location-filled",
          size: "18",
          color: "#666"
        }),
        d: common_vendor.t(scenicData.value.address),
        e: common_vendor.p({
          type: "clock",
          size: "18",
          color: "#666"
        }),
        f: common_vendor.t(scenicData.value.openTime),
        g: common_vendor.p({
          type: "money",
          size: "18",
          color: "#666"
        }),
        h: common_vendor.t(scenicData.value.ticketPrice),
        i: common_vendor.t(scenicData.value.description),
        j: common_vendor.f(scenicData.value.reviews, (review, index, i0) => {
          return common_vendor.e({
            a: review.avatar,
            b: common_vendor.t(review.username),
            c: common_vendor.t(review.content),
            d: common_vendor.t(formatTime(review.time)),
            e: review.images.length > 0
          }, review.images.length > 0 ? {
            f: common_vendor.f(review.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(review.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            g: index
          });
        }),
        k: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#fff"
        }),
        l: common_vendor.o(navigateToReview),
        m: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scenic/scenic.js.map
