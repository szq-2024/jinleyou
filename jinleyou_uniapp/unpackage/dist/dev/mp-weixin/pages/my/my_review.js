"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Math) {
  (EmptyState + CardList + LoadingOverlay)();
}
const CardList = () => "../../components/CardList.js";
const EmptyState = () => "../../components/EmptyState.js";
const LoadingOverlay = () => "../../components/LoadingOverlay.js";
const _sfc_main = {
  __name: "my_review",
  setup(__props) {
    const reviews = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const fetchReviews = async () => {
      try {
        isLoading.value = true;
        const response = await api_http.http.get("/api/user/reviews");
        reviews.value = response.data.map((review) => {
          const processed = {
            ...review,
            id: review.reviewId,
            images: review.images.map((img) => {
              const processedUrl = img.startsWith("http") ? img : `${api_http.ENV_CONFIG["development"]}${img}`;
              return processedUrl;
            })
          };
          return processed;
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_review.vue:52", "获取评论失败:", error);
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
      } finally {
        isLoading.value = false;
      }
    };
    const handleDelete = async (item) => {
      try {
        const { confirm } = await common_vendor.index.showModal({
          title: "确认删除",
          content: "确定要删除这条评论吗？删除后不可恢复"
        });
        if (!confirm)
          return;
        await api_http.http.delete(`/api/user/reviews/${item.id}`);
        reviews.value = reviews.value.filter((r) => r.id !== item.id);
        common_vendor.index.showToast({ title: "删除成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_review.vue:73", "删除失败:", error);
        common_vendor.index.showToast({ title: "删除失败", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      fetchReviews();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoading.value && reviews.value.length === 0
      }, !isLoading.value && reviews.value.length === 0 ? {
        b: common_vendor.p({
          description: "您还没有发表过任何评论"
        })
      } : {
        c: common_vendor.o(handleDelete),
        d: common_vendor.p({
          items: reviews.value,
          type: "review",
          ["show-delete"]: true
        })
      }, {
        e: common_vendor.p({
          visible: isLoading.value
        }),
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f586f099"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my_review.js.map
