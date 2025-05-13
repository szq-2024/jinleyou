"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
if (!Array) {
  const _component_form_field = common_vendor.resolveComponent("form-field");
  const _component_loading_overlay = common_vendor.resolveComponent("loading-overlay");
  (_component_form_field + _component_loading_overlay)();
}
const _sfc_main = {
  __name: "create-plans",
  setup(__props) {
    const form = common_vendor.ref({
      title: "",
      date: "",
      destination: "",
      preference: "",
      description: ""
    });
    const isLoading = common_vendor.ref(false);
    const tianjinPlaces = ["五大道", "意式风情街", "天津之眼", "古文化街"];
    const preferenceOptions = ["美食", "历史", "自然", "摄影", "亲子"];
    const onDateChange = (e) => {
      form.value.date = e.detail.value;
    };
    const onDestinationChange = (e) => {
      form.value.destination = tianjinPlaces[e.detail.value];
    };
    const onPreferenceChange = (e) => {
      form.value.preference = preferenceOptions[e.detail.value];
    };
    const submitForm = async () => {
      if (!validateForm())
        return;
      try {
        isLoading.value = true;
        await api_http.http.post("/api/travel-plans", form.value);
        common_vendor.index.showToast({ title: "发布成功", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      } catch (error) {
        handleError(error);
      } finally {
        isLoading.value = false;
      }
    };
    const validateForm = () => {
      const fields = [
        { key: "title", message: "请填写计划标题" },
        { key: "date", message: "请选择出发日期" },
        { key: "destination", message: "请选择目的地" },
        { key: "preference", message: "请选择旅行偏好" },
        { key: "description", message: "请填写计划描述" }
      ];
      for (const field of fields) {
        if (!form.value[field.key]) {
          common_vendor.index.showToast({ title: field.message, icon: "none" });
          return false;
        }
      }
      return true;
    };
    const handleError = (error) => {
      common_vendor.index.__f__("error", "at pages/partner/create-plans.vue:128", "提交失败:", error);
      common_vendor.index.showToast({
        title: `发布失败: ${error.message || "未知错误"}`,
        icon: "none",
        duration: 3e3
      });
    };
    return (_ctx, _cache) => {
      return {
        a: form.value.title,
        b: common_vendor.o(($event) => form.value.title = $event.detail.value),
        c: common_vendor.p({
          label: "计划标题",
          required: true
        }),
        d: common_vendor.t(form.value.date || "请选择日期"),
        e: common_vendor.o(onDateChange),
        f: common_vendor.p({
          label: "出发日期",
          required: true
        }),
        g: common_vendor.t(form.value.destination || "请选择目的地"),
        h: tianjinPlaces,
        i: common_vendor.o(onDestinationChange),
        j: common_vendor.p({
          label: "目的地",
          required: true
        }),
        k: common_vendor.t(form.value.preference || "请选择偏好"),
        l: preferenceOptions,
        m: common_vendor.o(onPreferenceChange),
        n: common_vendor.p({
          label: "旅行偏好",
          required: true
        }),
        o: form.value.description,
        p: common_vendor.o(($event) => form.value.description = $event.detail.value),
        q: common_vendor.p({
          label: "计划描述",
          required: true
        }),
        r: common_vendor.o(submitForm),
        s: common_vendor.p({
          visible: isLoading.value
        }),
        t: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-575d5ab5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/partner/create-plans.js.map
