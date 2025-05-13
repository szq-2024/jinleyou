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
      validator: (value) => ["plan", "guide"].includes(value)
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
      guide: "导游服务"
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
          } : common_vendor.e({
            g: common_vendor.t(typeMap[__props.type]),
            h: common_vendor.t(item.destination),
            i: common_vendor.t(item.type),
            j: common_vendor.t(item.price),
            k: common_vendor.t(item.description),
            l: __props.showDelete
          }, __props.showDelete ? {
            m: common_vendor.o(($event) => _ctx.$emit("delete", item), index)
          } : {
            n: common_vendor.o(($event) => _ctx.$emit("chat", item), index)
          }), {
            o: index,
            p: common_vendor.o(($event) => handleClick(item), index)
          });
        }),
        b: __props.type === "plan",
        c: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ef655cc5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CardList.js.map
