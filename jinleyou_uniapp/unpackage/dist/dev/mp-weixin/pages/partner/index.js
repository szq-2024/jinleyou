"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Math) {
  (EmptyState + CardList + LoadingOverlay)();
}
const EmptyState = () => "../../components/EmptyState.js";
const CardList = () => "../../components/CardList.js";
const LoadingOverlay = () => "../../components/LoadingOverlay.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const activeTab = common_vendor.ref("plans");
    const isLoading = common_vendor.ref(false);
    const plans = common_vendor.ref([]);
    const guides = common_vendor.ref([]);
    const loadData = () => {
      Promise.all([fetchPlans(), fetchGuides()]);
    };
    const filteredPlans = common_vendor.computed(() => {
      return plans.value.filter(
        (plan) => common_vendor.dayjs(plan.date).isSameOrAfter(common_vendor.dayjs().startOf("day"))
      );
    });
    const filteredGuides = common_vendor.computed(() => guides.value);
    const navigateToCreate = (type) => {
      common_vendor.index.navigateTo({
        url: `/pages/partner/create-${type}`
      });
    };
    const startChat = (item) => {
      var _a;
      if (!((_a = item == null ? void 0 : item.user) == null ? void 0 : _a.id)) {
        common_vendor.index.__f__("error", "at pages/partner/index.vue:97", "Invalid user data:", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?userId=${item.user.id}&title=${encodeURIComponent(item.title)}`
      });
    };
    const fetchData = async (url) => {
      try {
        isLoading.value = true;
        const response = await api_http.http.get(url);
        return response.data || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/partner/index.vue:113", "数据获取失败:", error);
        return [];
      } finally {
        isLoading.value = false;
      }
    };
    const fetchPlans = async () => {
      plans.value = await fetchData("/api/travel-plans");
    };
    const fetchGuides = async () => {
      guides.value = await fetchData("/api/guide-services");
    };
    common_vendor.onShow(() => {
      loadData();
    });
    common_vendor.onMounted(() => {
      Promise.all([fetchPlans(), fetchGuides()]);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n({
          "active-tab": activeTab.value === "plans"
        }),
        b: common_vendor.o(($event) => activeTab.value = "plans"),
        c: common_vendor.n({
          "active-tab": activeTab.value === "guides"
        }),
        d: common_vendor.o(($event) => activeTab.value = "guides"),
        e: activeTab.value === "plans"
      }, activeTab.value === "plans" ? common_vendor.e({
        f: filteredPlans.value.length === 0
      }, filteredPlans.value.length === 0 ? {
        g: common_vendor.o(($event) => navigateToCreate("plan")),
        h: common_vendor.p({
          description: "暂时没有找到旅行计划",
          ["action-text"]: "创建计划"
        })
      } : {
        i: common_vendor.o(startChat),
        j: common_vendor.p({
          items: filteredPlans.value,
          type: "plan"
        })
      }) : common_vendor.e({
        k: filteredGuides.value.length === 0
      }, filteredGuides.value.length === 0 ? {
        l: common_vendor.o(($event) => navigateToCreate("guide")),
        m: common_vendor.p({
          description: "暂时没有可预约的导游",
          ["action-text"]: "发布服务"
        })
      } : {
        n: common_vendor.o(startChat),
        o: common_vendor.o(startChat),
        p: common_vendor.p({
          items: filteredGuides.value,
          type: "guide"
        })
      }), {
        q: common_vendor.t(activeTab.value === "plans" ? "✏️" : "✨"),
        r: common_vendor.o(($event) => navigateToCreate(activeTab.value)),
        s: common_vendor.p({
          visible: isLoading.value
        }),
        t: common_vendor.gei(_ctx, "")
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/partner/index.js.map
