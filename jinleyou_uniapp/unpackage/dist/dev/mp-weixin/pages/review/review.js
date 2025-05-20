"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const _sfc_main = {
  data() {
    return {
      scenicId: null,
      content: "",
      imageList: [],
      // {url: string, uploading: bool, progress: number}
      submitting: false
    };
  },
  computed: {
    canSubmit() {
      return this.content.trim().length >= 5 && !this.imageList.some((img) => img.uploading);
    }
  },
  onLoad(options) {
    this.scenicId = options.id;
  },
  methods: {
    // 选择图片
    async chooseImage() {
      const remain = 9 - this.imageList.length;
      if (remain <= 0)
        return;
      try {
        const res = await common_vendor.index.chooseImage({
          count: remain,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        res.tempFilePaths.forEach((path) => {
          this.imageList.push({
            url: path,
            uploading: true,
            progress: 0
          });
          this.uploadImage(path, this.imageList.length - 1);
        });
      } catch (error) {
        common_vendor.index.showToast({ title: "选择图片失败", icon: "none" });
      }
    },
    // 上传单张图片
    async uploadImage(filePath, index) {
      try {
        const uploadRes = await new Promise((resolve, reject) => {
          const uploadTask = common_vendor.index.uploadFile({
            url: `${api_http.ENV_CONFIG["development"]}/api/scenic-spots/upload`,
            filePath,
            name: "file",
            header: {
              Authorization: `Bearer ${common_vendor.index.getStorageSync("token")}`
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
          uploadTask.onProgressUpdate = (res) => {
            this.imageList[index].progress = res.progress;
            if (res.progress === 100) {
              setTimeout(() => {
                this.imageList[index].uploading = false;
              }, 300);
            }
          };
        });
        if (uploadRes.statusCode !== 200) {
          throw new Error(`上传失败，状态码：${uploadRes.statusCode}`);
        }
        const data = JSON.parse(uploadRes.data);
        if (data.code !== 200) {
          throw new Error(data.msg || "上传失败");
        }
        const fullUrl = data.data.url.startsWith("http") ? data.data.url : `${api_http.ENV_CONFIG["development"]}${data.data.url}`;
        this.imageList[index].url = fullUrl;
        this.imageList[index].uploading = false;
      } catch (error) {
        this.imageList.splice(index, 1);
        common_vendor.index.showToast({
          title: `上传失败: ${error.message}`,
          icon: "none",
          duration: 3e3
        });
      }
    },
    // 删除图片
    deleteImage(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            this.imageList.splice(index, 1);
          }
        }
      });
    },
    // 图片加载失败处理
    handleImageError(index) {
      this.imageList.splice(index, 1);
      common_vendor.index.showToast({
        title: "图片加载失败，已移除",
        icon: "none"
      });
    },
    // 预览图片
    previewImage(index) {
      common_vendor.index.previewImage({
        current: index,
        urls: this.imageList.map((img) => img.url)
      });
    },
    // 提交评论
    async submitReview() {
      if (!this.canSubmit || this.submitting)
        return;
      this.submitting = true;
      if (!this.scenicId) {
        common_vendor.index.showToast({ title: "参数错误，无法提交评论", icon: "none" });
        return;
      }
      try {
        const images = this.imageList.map((img) => img.url);
        const { code, msg } = await api_http.http.post(
          `/api/scenic-spots/${this.scenicId}/reviews`,
          {
            content: this.content.trim(),
            images
          }
        );
        if (code === 200) {
          common_vendor.index.showToast({ title: "评论提交成功" });
          common_vendor.index.$emit("review-submitted");
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        } else {
          common_vendor.index.showToast({ title: msg || "提交失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/review/review.vue:231", "提交失败:", error);
        common_vendor.index.showToast({ title: "提交失败，请重试", icon: "none" });
      } finally {
        this.submitting = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.content,
    b: common_vendor.o(($event) => $data.content = $event.detail.value),
    c: common_vendor.t($data.content.length),
    d: common_vendor.f($data.imageList, (img, index, i0) => {
      return common_vendor.e({
        a: img.url,
        b: common_vendor.o(($event) => $options.previewImage(index), img.url),
        c: common_vendor.o(($event) => $options.handleImageError(index), img.url),
        d: common_vendor.o(($event) => $options.deleteImage(index), img.url),
        e: "7018a65d-0-" + i0,
        f: img.uploading
      }, img.uploading ? {
        g: img.progress
      } : {}, {
        h: img.url
      });
    }),
    e: common_vendor.p({
      type: "close",
      size: "20",
      color: "#fff"
    }),
    f: $data.imageList.length < 9
  }, $data.imageList.length < 9 ? {
    g: common_vendor.p({
      type: "plusempty",
      size: "40",
      color: "#ccc"
    }),
    h: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    i: !$data.submitting
  }, !$data.submitting ? {} : {
    j: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16
    })
  }, {
    k: !$options.canSubmit || $data.submitting ? 1 : "",
    l: !$options.canSubmit || $data.submitting,
    m: common_vendor.o((...args) => $options.submitReview && $options.submitReview(...args)),
    n: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7018a65d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/review/review.js.map
