"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const pageSize = 10;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const scenicList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const isRefreshing = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const handleDetail = (item) => {
      try {
        common_vendor.index.navigateTo({
          url: `/pages/scenic/scenic?id=${item.id}`
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:54", "导航失败:", error);
        common_vendor.index.showToast({
          title: "打开详情失败",
          icon: "none"
        });
      }
    };
    const fetchScenicList = async (pageNum = 1) => {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const response = await api_http.http.get("/api/scenic-spots", {
          params: {
            // 正确传递GET参数
            page: pageNum,
            pageSize
          }
        });
        if (!response || !response.data || !Array.isArray(response.data.data)) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:78", "无效的数据结构:", response);
          throw new Error("服务器返回数据格式异常");
        }
        const newData = response.data.data.map((item) => ({
          ...item,
          imageUrl: item.imageUrl ? api_http.ENV_CONFIG["development"] + item.imageUrl : ""
        }));
        scenicList.value = pageNum === 1 ? newData : [...scenicList.value, ...newData];
        hasMore.value = pageNum * pageSize < response.data.total;
        if (hasMore.value)
          page.value = pageNum;
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "加载失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
        isRefreshing.value = false;
      }
    };
    const loadMore = () => {
      if (!hasMore.value || loading.value)
        return;
      page.value += 1;
      fetchScenicList(page.value);
    };
    const onRefresh = () => {
      isRefreshing.value = true;
      fetchScenicList(1);
    };
    common_vendor.onMounted(() => fetchScenicList());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(scenicList.value, (item, index, i0) => {
          return {
            a: item.imageUrl,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.description),
            d: index,
            e: common_vendor.o(($event) => handleDetail(item), index)
          };
        }),
        b: hasMore.value
      }, hasMore.value ? {} : {}, {
        c: common_vendor.o(loadMore),
        d: isRefreshing.value,
        e: common_vendor.o(onRefresh),
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
