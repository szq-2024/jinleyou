"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "CardList",
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      validator: (value) => ["plans", "guides", "review"].includes(value)
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ["itemClick", "chat"],
  setup(__props, { emit: __emit }) {
    const typeMap = {
      plan: "旅行计划",
      guide: "导游服务",
      review: "用户评论"
    };
    const emit = __emit;
    const handleClick = (item) => {
      emit("itemClick", item);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.items, (item, index, i0) => {
          return common_vendor.e(__props.type === "plan" ? {
            a: common_vendor.t(typeMap[__props.type]),
            b: common_vendor.t(item.title),
            c: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(item.date).format("YY/MM/DD")),
            d: common_vendor.t(item.destination),
            e: common_vendor.t(item.preference),
            f: common_vendor.t(item.description)
          } : {}, __props.type === "guide" ? common_vendor.e({
            g: common_vendor.t(typeMap[__props.type]),
            h: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(item.serviceDate).format("YYYY-MM-DD")),
            i: common_vendor.t(item.destination),
            j: common_vendor.t(item.type),
            k: common_vendor.t(item.duration),
            l: common_vendor.t(item.price),
            m: common_vendor.t(item.description),
            n: __props.showDelete
          }, __props.showDelete ? {
            o: common_vendor.o(($event) => _ctx.$emit("delete", item), index)
          } : {
            p: common_vendor.o(($event) => _ctx.$emit("chat", item), index)
          }) : {}, __props.type === "review" ? common_vendor.e({
            q: item.avatar,
            r: common_vendor.t(item.nickname),
            s: __props.showDelete
          }, __props.showDelete ? {
            t: common_vendor.o(($event) => _ctx.$emit("delete", item), index)
          } : {}, {
            v: common_vendor.t(item.scenicName),
            w: common_vendor.t(item.content),
            x: item.images && item.images.length
          }, item.images && item.images.length ? {
            y: common_vendor.f(item.images, (img, idx, i1) => {
              return {
                a: idx,
                b: img
              };
            })
          } : {}, {
            z: common_vendor.t(common_vendor.unref(common_vendor.dayjs)(item.createdAt).format("YYYY-MM-DD"))
          }) : {}, {
            A: index,
            B: common_vendor.o(($event) => handleClick(item), index)
          });
        }),
        b: __props.type === "plan",
        c: __props.type === "guide",
        d: __props.type === "review",
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ef655cc5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CardList.js.map
