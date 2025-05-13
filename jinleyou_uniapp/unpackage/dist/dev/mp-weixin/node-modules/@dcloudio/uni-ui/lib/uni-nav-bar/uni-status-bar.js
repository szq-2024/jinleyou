"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "UniStatusBar",
  data() {
    return {
      statusBarHeight: common_vendor.index.getWindowInfo().statusBarHeight + "px"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.statusBarHeight,
    b: common_vendor.gei(_ctx, "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/node-modules/@dcloudio/uni-ui/lib/uni-nav-bar/uni-status-bar.js.map
