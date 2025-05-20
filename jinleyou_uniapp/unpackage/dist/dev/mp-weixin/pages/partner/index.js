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
    const isCollapsed = common_vendor.ref(false);
    const plans = common_vendor.ref([]);
    const guides = common_vendor.ref([]);
    const filterDateRange = common_vendor.ref([]);
    const filterLocation = common_vendor.ref("");
    const filterPreferences = common_vendor.ref([]);
    const validPreferences = ["美食", "历史", "自然", "摄影", "亲子"];
    const filterGuideDateRange = common_vendor.ref([]);
    const filterDestination = common_vendor.ref("");
    const filterServiceTypes = common_vendor.ref([]);
    const validServiceTypes = ["历史讲解", "户外探险", "城市观光", "美食文化"];
    const filteredPlans = common_vendor.computed(() => {
      return plans.value.filter(
        (plan) => common_vendor.dayjs(plan.date).isSameOrAfter(common_vendor.dayjs().startOf("day")) && (filterLocation.value ? plan.destination.includes(filterLocation.value) : true) && (filterDateRange.value.length === 2 ? common_vendor.dayjs(plan.date).isBetween(filterDateRange.value[0], filterDateRange.value[1]) : true) && (filterPreferences.value.length > 0 ? filterPreferences.value.includes(plan.preference) : true)
      );
    });
    const filteredGuides = common_vendor.computed(() => {
      return guides.value.filter(
        (guide) => common_vendor.dayjs(guide.serviceDate).isSameOrAfter(common_vendor.dayjs().startOf("day")) && (filterDestination.value ? guide.destination.includes(filterDestination.value) : true) && (filterGuideDateRange.value.length === 2 ? common_vendor.dayjs(guide.serviceDate).isBetween(filterGuideDateRange.value[0], filterGuideDateRange.value[1]) : true) && (filterServiceTypes.value.length > 0 ? filterServiceTypes.value.includes(guide.type) : true)
      );
    });
    const toggleFilterCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };
    const resetFilters = () => {
      if (activeTab.value === "plans") {
        filterDateRange.value = [];
        filterLocation.value = "";
        filterPreferences.value = [];
      } else {
        filterGuideDateRange.value = [];
        filterDestination.value = "";
        filterServiceTypes.value = [];
      }
      common_vendor.nextTick$1(() => {
        loadData();
      });
    };
    const navigateToCreate = (type) => {
      common_vendor.index.navigateTo({
        url: `/pages/partner/create-${type}`
      });
    };
    const startChat = (item) => {
      var _a;
      const userId = item.user_id || ((_a = item.user) == null ? void 0 : _a.id);
      if (!userId) {
        common_vendor.index.__f__("error", "at pages/partner/index.vue:252", "Invalid user data:", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?userId=${userId}&title=${encodeURIComponent(item.title)}`
      });
    };
    const handleDateStart = (e) => {
      filterDateRange.value[0] = e.detail.value;
    };
    const handleDateEnd = (e) => {
      filterDateRange.value[1] = e.detail.value;
    };
    const handleGuideDateStart = (e) => {
      filterGuideDateRange.value[0] = e.detail.value;
    };
    const handleGuideDateEnd = (e) => {
      filterGuideDateRange.value[1] = e.detail.value;
    };
    const handlePreferenceChange = (e) => {
      filterPreferences.value = e.detail.value;
    };
    const handleServiceTypeChange = (e) => {
      filterServiceTypes.value = e.detail.value;
    };
    const fetchPlans = async () => {
      try {
        isLoading.value = true;
        const params = {
          dateStart: filterDateRange.value[0],
          dateEnd: filterDateRange.value[1],
          location: filterLocation.value,
          preferences: filterPreferences.value.join(",")
        };
        const response = await api_http.http.get("/api/travel-plans", { params });
        plans.value = response.data || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/partner/index.vue:298", "获取旅行计划失败:", error);
        plans.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    const fetchGuides = async () => {
      try {
        isLoading.value = true;
        const params = {
          dateStart: filterGuideDateRange.value[0],
          dateEnd: filterGuideDateRange.value[1],
          destination: filterDestination.value,
          type: filterServiceTypes.value.join(",")
        };
        const response = await api_http.http.get("/api/guide-services", { params });
        guides.value = response.data || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/partner/index.vue:317", "获取导游服务失败:", error);
        guides.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    const loadData = () => {
      if (activeTab.value === "plans") {
        fetchPlans();
      } else {
        fetchGuides();
      }
    };
    common_vendor.watch(activeTab, (newVal) => {
      isCollapsed.value = false;
      resetFilters();
    });
    common_vendor.onShow(() => {
      loadData();
    });
    common_vendor.onMounted(() => {
      loadData();
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
        e: common_vendor.t(isCollapsed.value ? "展开" : "收起"),
        f: common_vendor.o(toggleFilterCollapse),
        g: !isCollapsed.value
      }, !isCollapsed.value ? common_vendor.e({
        h: activeTab.value === "plans"
      }, activeTab.value === "plans" ? {
        i: common_vendor.t(filterDateRange.value[0] || "开始日期"),
        j: filterDateRange.value[0],
        k: common_vendor.o(handleDateStart),
        l: common_vendor.t(filterDateRange.value[1] || "结束日期"),
        m: filterDateRange.value[1],
        n: common_vendor.o(handleDateEnd),
        o: filterLocation.value,
        p: common_vendor.o(($event) => filterLocation.value = $event.detail.value),
        q: common_vendor.f(validPreferences, (pref, k0, i0) => {
          return {
            a: pref,
            b: filterPreferences.value.includes(pref),
            c: common_vendor.t(pref),
            d: pref
          };
        }),
        r: common_vendor.o(handlePreferenceChange)
      } : {
        s: common_vendor.t(filterGuideDateRange.value[0] || "开始日期"),
        t: filterGuideDateRange.value[0],
        v: common_vendor.o(handleGuideDateStart),
        w: common_vendor.t(filterGuideDateRange.value[1] || "结束日期"),
        x: filterGuideDateRange.value[1],
        y: common_vendor.o(handleGuideDateEnd),
        z: filterDestination.value,
        A: common_vendor.o(($event) => filterDestination.value = $event.detail.value),
        B: common_vendor.f(validServiceTypes, (type, k0, i0) => {
          return {
            a: type,
            b: filterServiceTypes.value.includes(type),
            c: common_vendor.t(type),
            d: type
          };
        }),
        C: common_vendor.o(handleServiceTypeChange)
      }, {
        D: common_vendor.o(resetFilters),
        E: common_vendor.o(loadData)
      }) : {}, {
        F: activeTab.value === "plans"
      }, activeTab.value === "plans" ? common_vendor.e({
        G: filteredPlans.value.length === 0
      }, filteredPlans.value.length === 0 ? {
        H: common_vendor.o(($event) => navigateToCreate("plan")),
        I: common_vendor.p({
          description: "暂时没有找到旅行计划",
          ["action-text"]: "创建计划"
        })
      } : {
        J: common_vendor.o(startChat),
        K: common_vendor.p({
          items: filteredPlans.value,
          type: "plan"
        })
      }) : common_vendor.e({
        L: filteredGuides.value.length === 0
      }, filteredGuides.value.length === 0 ? {
        M: common_vendor.o(($event) => navigateToCreate("guide")),
        N: common_vendor.p({
          description: "暂时没有可预约的导游",
          ["action-text"]: "发布服务"
        })
      } : {
        O: common_vendor.o(startChat),
        P: common_vendor.p({
          items: filteredGuides.value,
          type: "guide"
        })
      }), {
        Q: common_vendor.t(activeTab.value === "plans" ? "✏️" : "✨"),
        R: common_vendor.o(($event) => navigateToCreate(activeTab.value)),
        S: common_vendor.p({
          visible: isLoading.value
        }),
        T: common_vendor.gei(_ctx, "")
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/partner/index.js.map
