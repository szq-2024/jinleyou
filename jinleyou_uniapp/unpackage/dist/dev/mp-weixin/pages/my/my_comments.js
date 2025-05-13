"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_util = require("../../utils/util.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      comments: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      refreshing: false
    };
  },
  onLoad() {
    this.loadComments();
  },
  methods: {
    // 加载评论
    async loadComments() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const res = await common_vendor.index.request({
          url: "/api/comments/my",
          method: "GET",
          data: {
            page: this.page,
            page_size: this.pageSize
          },
          header: {
            "Authorization": common_vendor.index.getStorageSync("token")
          }
        });
        if (res.data.code === 200) {
          const data = res.data.data;
          this.comments = this.page === 1 ? data.list : [...this.comments, ...data.list];
          this.noMore = data.list.length < this.pageSize;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_comments.vue:111", "获取评论失败:", error);
        common_vendor.index.showToast({
          title: "获取评论失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
    // 下拉刷新
    onRefresh() {
      this.refreshing = true;
      this.page = 1;
      this.loadComments();
    },
    // 上拉加载更多
    loadMore() {
      if (this.loading || this.noMore)
        return;
      this.page++;
      this.loadComments();
    },
    // 显示删除确认对话框
    showDeleteDialog(commentId, index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.deleteComment(commentId, index);
          }
        }
      });
    },
    // 删除评论
    async deleteComment(commentId, index) {
      try {
        const res = await common_vendor.index.request({
          url: `/api/comments/${commentId}`,
          method: "DELETE",
          header: {
            "Authorization": common_vendor.index.getStorageSync("token")
          }
        });
        if (res.data.code === 200) {
          common_vendor.index.showToast({
            title: "删除成功"
          });
          this.comments.splice(index, 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_comments.vue:167", "删除评论失败:", error);
        common_vendor.index.showToast({
          title: "删除失败",
          icon: "none"
        });
      }
    },
    // 跳转到评论目标
    toTarget(targetId, type) {
      let url = "";
      switch (type) {
        case "article":
          url = `/pages/article/detail?id=${targetId}`;
          break;
        case "product":
          url = `/pages/product/detail?id=${targetId}`;
          break;
        default:
          return;
      }
      common_vendor.index.navigateTo({ url });
    },
    // 获取评论目标类型
    getTargetType(type) {
      const types = {
        article: "文章",
        product: "商品",
        video: "视频"
        // 其他类型...
      };
      return types[type] || "未知类型";
    },
    // 格式化时间
    formatTime: utils_util.formatTime,
    // 返回
    back() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.back),
    b: common_vendor.p({
      title: "我的评论",
      ["left-icon"]: "back",
      border: false,
      fixed: true
    }),
    c: common_vendor.f($data.comments, (item, index, i0) => {
      return {
        a: item.user.avatar || "/static/default-avatar.png",
        b: common_vendor.t(item.user.nickname),
        c: common_vendor.t($options.formatTime(item.create_time)),
        d: "53dc3de7-1-" + i0,
        e: common_vendor.o(($event) => $options.showDeleteDialog(item.id, index), item.id),
        f: common_vendor.t(item.content),
        g: common_vendor.t($options.getTargetType(item.type)),
        h: "53dc3de7-2-" + i0,
        i: common_vendor.o(($event) => $options.toTarget(item.target_id, item.type), item.id),
        j: item.id
      };
    }),
    d: common_vendor.p({
      type: "trash",
      size: "18",
      color: "#999"
    }),
    e: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    f: $data.loading
  }, $data.loading ? {} : {}, {
    g: $data.noMore
  }, $data.noMore ? {} : {}, {
    h: $data.comments.length === 0 && !$data.loading
  }, $data.comments.length === 0 && !$data.loading ? {
    i: common_assets._imports_0$1,
    j: common_vendor.o((...args) => $options.loadComments && $options.loadComments(...args))
  } : {}, {
    k: $data.refreshing,
    l: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    m: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    n: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-53dc3de7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my_comments.js.map
