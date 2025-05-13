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
  __name: "my_services",
  setup(__props) {
    const services = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const fetchServices = async () => {
      try {
        isLoading.value = true;
        const response = await api_http.http.get("/api/guide-services/my");
        services.value = response.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_services.vue:43", "获取服务失败:", error);
        common_vendor.index.showToast({ title: "数据加载失败", icon: "none" });
      } finally {
        isLoading.value = false;
      }
    };
    const handleDelete = async (item) => {
      try {
        const { confirm } = await common_vendor.index.showModal({
          title: "确认删除",
          content: "确定要删除这个服务吗？删除后不可恢复"
        });
        if (!confirm)
          return;
        await api_http.http.delete(`/api/guide-services/${item.id}`);
        services.value = services.value.filter((s) => s.id !== item.id);
        common_vendor.index.showToast({ title: "删除成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my_services.vue:64", "删除失败:", error);
        common_vendor.index.showToast({ title: "删除失败", icon: "none" });
      }
    };
    const navigateToCreate = () => {
      common_vendor.index.navigateTo({
        url: "/pages/partner/create-guides"
      });
    };
    common_vendor.onMounted(() => {
      fetchServices();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoading.value && services.value.length === 0
      }, !isLoading.value && services.value.length === 0 ? {
        b: common_vendor.o(navigateToCreate),
        c: common_vendor.p({
          description: "您还没有发布过导游服务",
          ["action-text"]: "立即发布"
        })
      } : {
        d: common_vendor.o(handleDelete),
        e: common_vendor.p({
          items: services.value,
          type: "guide",
          ["show-delete"]: true,
          ["show-chat"]: false
        })
      }, {
        f: common_vendor.p({
          visible: isLoading.value
        }),
        g: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-564570f5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my_services.js.map
