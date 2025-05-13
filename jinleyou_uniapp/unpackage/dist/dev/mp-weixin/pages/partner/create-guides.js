"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Array) {
  const _component_form_field = common_vendor.resolveComponent("form-field");
  const _component_loading_overlay = common_vendor.resolveComponent("loading-overlay");
  (_component_form_field + _component_loading_overlay)();
}
const _sfc_main = {
  __name: "create-guides",
  setup(__props) {
    const form = common_vendor.ref({
      destination: "",
      serviceDate: "",
      type: "",
      duration: null,
      price: null,
      description: ""
    });
    const isSubmitting = common_vendor.ref(false);
    const destinations = common_vendor.ref([
      "天津之眼",
      "五大道",
      "古文化街",
      "意式风情街",
      "海河游船",
      "瓷房子",
      "天津博物馆",
      "盘山"
    ]);
    const serviceTypeOptions = ["历史讲解", "美食导览", "城市观光", "户外探险"];
    const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);
    const validateForm = () => {
      const requiredFields = [
        { key: "destination", message: "请选择服务景点" },
        { key: "serviceDate", message: "请选择服务日期" },
        { key: "type", message: "请选择服务类型" },
        { key: "duration", message: "请选择服务时长" },
        { key: "price", message: "请填写服务价格" },
        { key: "description", message: "请填写服务描述" }
      ];
      for (const field of requiredFields) {
        if (!form.value[field.key]) {
          common_vendor.index.showToast({ title: field.message, icon: "none" });
          return false;
        }
      }
      if (form.value.price < 0) {
        common_vendor.index.showToast({ title: "价格需大于0元", icon: "none" });
        return false;
      }
      return true;
    };
    const submitForm = async () => {
      if (!validateForm())
        return;
      try {
        isSubmitting.value = true;
        await api_http.http.post("/api/guide-services", form.value);
        common_vendor.index.showToast({ title: "发布成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            success() {
              var _a;
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 1];
              if ((_a = prevPage.$vm) == null ? void 0 : _a.handleRefresh) {
                prevPage.$vm.handleRefresh();
              }
            }
          });
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/partner/create-guides.vue:161", "提交失败:", error);
        common_vendor.index.showToast({
          title: `发布失败: ${error.message || "未知错误"}`,
          icon: "none",
          duration: 3e3
        });
      } finally {
        isSubmitting.value = false;
      }
    };
    const handleDestinationChange = (e) => {
      const index = e.detail.value;
      form.value.destination = destinations.value[index];
    };
    const handleDateChange = (e) => {
      form.value.serviceDate = e.detail.value;
    };
    const handleTypeChange = (e) => {
      const index = e.detail.value;
      form.value.type = serviceTypeOptions[index];
    };
    const handleDurationChange = (e) => {
      const index = e.detail.value;
      form.value.duration = durationOptions[index];
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(form.value.destination || "请选择景点"),
        b: destinations.value,
        c: common_vendor.o(handleDestinationChange),
        d: common_vendor.p({
          label: "服务景点",
          required: true
        }),
        e: common_vendor.t(form.value.serviceDate || "请选择日期"),
        f: common_vendor.o(handleDateChange),
        g: common_vendor.p({
          label: "服务日期",
          required: true
        }),
        h: common_vendor.t(form.value.type || "请选择服务类型"),
        i: serviceTypeOptions,
        j: common_vendor.o(handleTypeChange),
        k: common_vendor.p({
          label: "服务类型",
          required: true
        }),
        l: common_vendor.t(form.value.duration ? `${form.value.duration}小时` : "请选择时长"),
        m: common_vendor.unref(durationOptions),
        n: common_vendor.o(handleDurationChange),
        o: common_vendor.p({
          label: "服务时长",
          required: true
        }),
        p: form.value.price,
        q: common_vendor.o(common_vendor.m(($event) => form.value.price = $event.detail.value, {
          number: true
        })),
        r: common_vendor.p({
          label: "服务价格",
          required: true
        }),
        s: form.value.description,
        t: common_vendor.o(($event) => form.value.description = $event.detail.value),
        v: common_vendor.p({
          label: "服务描述",
          required: true
        }),
        w: common_vendor.o(submitForm),
        x: common_vendor.p({
          visible: isSubmitting.value
        }),
        y: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da79eebb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/partner/create-guides.js.map
