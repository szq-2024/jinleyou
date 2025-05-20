"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Math) {
  (EmptyState + LoadingOverlay)();
}
const EmptyState = () => "../../components/EmptyState.js";
const LoadingOverlay = () => "../../components/LoadingOverlay.js";
const _sfc_main = {
  __name: "my_trips",
  setup(__props) {
    const trips = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const fetchTrips = async () => {
      try {
        isLoading.value = true;
        const response = await api_http.http.get("/api/travel-plans/my");
        trips.value = response.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_trips.vue:63", "获取失败:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handleDelete = async (id) => {
      try {
        const { confirm } = await common_vendor.index.showModal({
          title: "确认删除",
          content: "确定要删除这个服务吗？删除后不可恢复"
        });
        await api_http.http.delete(`/api/travel-plans/${id}`);
        common_vendor.index.showToast({ title: "删除成功", icon: "success" });
        trips.value = trips.value.filter((item) => item.id !== id);
      } catch (error) {
        common_vendor.index.showToast({ title: "删除失败", icon: "none" });
      }
    };
    const navigateToCreate = () => {
      common_vendor.index.navigateTo({
        url: "/pages/partner/create-plans"
      });
    };
    common_vendor.onMounted(fetchTrips);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: trips.value.length === 0 && !isLoading.value
      }, trips.value.length === 0 && !isLoading.value ? {
        b: common_vendor.o(navigateToCreate),
        c: common_vendor.p({
          description: "您还没有发布过行程",
          ["action-text"]: "创建行程"
        })
      } : {}, {
        d: common_vendor.f(trips.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(item.date).format("YY/MM/DD")),
            c: common_vendor.t(item.destination),
            d: common_vendor.t(item.preference),
            e: common_vendor.t(item.description),
            f: common_vendor.o(($event) => handleDelete(item.id), index),
            g: index
          };
        }),
        e: common_vendor.p({
          visible: isLoading.value
        }),
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e6ef62c2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my_trips.js.map
