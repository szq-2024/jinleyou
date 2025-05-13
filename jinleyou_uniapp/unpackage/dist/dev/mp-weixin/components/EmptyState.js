"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  __name: "EmptyState",
  props: {
    description: {
      type: String,
      required: true
    },
    actionText: String
  },
  emits: ["action"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleAction = () => {
      emit("action");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.t(__props.description),
        c: __props.actionText
      }, __props.actionText ? {
        d: common_vendor.t(__props.actionText),
        e: common_vendor.o(handleAction)
      } : {}, {
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3454b0cd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/EmptyState.js.map
