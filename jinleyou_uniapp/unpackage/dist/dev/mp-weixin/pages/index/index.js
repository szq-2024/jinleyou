"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const scenicList = common_vendor.ref([
      {
        id: "1",
        name: "天津之眼",
        description: "世界上唯一建在桥上的摩天轮，天津地标性建筑",
        imageUrl: "/static/photo/tianjinzhiyan.jpg"
      },
      {
        id: "2",
        name: "五大道",
        description: '天津最具特色的洋楼建筑群，被誉为"万国建筑博览苑"',
        imageUrl: "/static/photo/wudadao.jpg"
      },
      {
        id: "3",
        name: "古文化街",
        description: "天津老字号店铺和手工艺品集中地，体验津门文化",
        imageUrl: "/static/photo/guwenhuajie.jpg"
      },
      {
        id: "4",
        name: "意式风情区",
        description: "亚洲最大的意式建筑群，感受异国风情",
        imageUrl: "/static/photo/yishifengqingqu.jpg"
      },
      {
        id: "5",
        name: "海河",
        description: "天津的母亲河，两岸风光旖旎，夜景迷人",
        imageUrl: "/static/photo/haihe.jpg"
      },
      {
        id: "6",
        name: "瓷房子",
        description: "用古瓷器装饰的独特建筑，世界建筑史上的奇迹",
        imageUrl: "/static/photo/cifangzi.jpg"
      },
      {
        id: "7",
        name: "天津博物馆",
        description: "展示天津历史文化的重要场所，馆藏丰富",
        imageUrl: "/static/photo/tianjinbowuguan.jpg"
      },
      {
        id: "8",
        name: "盘山",
        description: '天津著名的自然风景区，有"京东第一山"之称',
        imageUrl: "/static/photo/panshan.jpg"
      }
    ]);
    const page = common_vendor.ref(1);
    const hasMore = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const loadMore = () => {
      if (hasMore.value) {
        page.value++;
      }
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      setTimeout(() => {
        isRefreshing.value = false;
      }, 1e3);
    };
    const handleDetail = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/scenic/scenic?id=${item.id}`,
        success: () => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:122", "跳转详情页成功", item.id);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:125", "跳转详情页失败", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
    });
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
