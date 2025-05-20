"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      form: {
        usernameOrPhone: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      errors: {
        usernameOrPhone: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      showOldPassword: false,
      showNewPassword: false,
      loading: false
    };
  },
  computed: {
    formValid() {
      return this.form.usernameOrPhone && this.form.oldPassword && this.form.newPassword && this.form.confirmNewPassword && !Object.values(this.errors).some((err) => err);
    }
  },
  methods: {
    validate() {
      let valid = true;
      if (!this.form.usernameOrPhone.trim()) {
        this.errors.usernameOrPhone = "请输入用户名或手机号";
        valid = false;
      } else if (!/^(1[3-9]\d{9}|[\w\u4e00-\u9fa5]{4,20})$/.test(this.form.usernameOrPhone)) {
        this.errors.usernameOrPhone = "格式不正确";
        valid = false;
      }
      if (!this.form.oldPassword) {
        this.errors.oldPassword = "请输入原密码";
        valid = false;
      }
      if (!this.form.newPassword) {
        this.errors.newPassword = "请输入新密码";
        valid = false;
      } else if (this.form.newPassword.length < 6) {
        this.errors.newPassword = "密码长度至少6位";
        valid = false;
      }
      if (!this.form.confirmNewPassword) {
        this.errors.confirmNewPassword = "请确认密码";
        valid = false;
      } else if (this.form.confirmNewPassword !== this.form.newPassword) {
        this.errors.confirmNewPassword = "两次输入的密码不一致";
        valid = false;
      }
      return valid;
    },
    resetError(field) {
      this.errors[field] = "";
    },
    async handleChangePassword() {
      var _a;
      if (!this.validate())
        return;
      this.loading = true;
      try {
        const res = await api_http.http.post("/api/auth/change-password", {
          identifier: this.form.usernameOrPhone,
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword
        });
        if ((res == null ? void 0 : res.code) === 200) {
          common_vendor.index.showToast({
            title: "修改成功",
            icon: "success",
            complete: () => {
              common_vendor.index.navigateBack();
            }
          });
        } else {
          common_vendor.index.showToast({
            title: ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.message) || "修改失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/change_password.vue:191", "修改失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.p({
      type: "person",
      size: "20",
      color: "#2867CE"
    }),
    c: common_vendor.o(($event) => $options.resetError("usernameOrPhone")),
    d: $data.form.usernameOrPhone,
    e: common_vendor.o(($event) => $data.form.usernameOrPhone = $event.detail.value),
    f: $data.errors.usernameOrPhone ? 1 : "",
    g: $data.errors.usernameOrPhone
  }, $data.errors.usernameOrPhone ? {
    h: common_vendor.t($data.errors.usernameOrPhone)
  } : {}, {
    i: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    j: !$data.showOldPassword,
    k: common_vendor.o(($event) => $options.resetError("oldPassword")),
    l: $data.form.oldPassword,
    m: common_vendor.o(($event) => $data.form.oldPassword = $event.detail.value),
    n: common_vendor.p({
      type: $data.showOldPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    o: common_vendor.o(($event) => $data.showOldPassword = !$data.showOldPassword),
    p: $data.errors.oldPassword ? 1 : "",
    q: $data.errors.oldPassword
  }, $data.errors.oldPassword ? {
    r: common_vendor.t($data.errors.oldPassword)
  } : {}, {
    s: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    t: !$data.showNewPassword,
    v: common_vendor.o(($event) => $options.resetError("newPassword")),
    w: $data.form.newPassword,
    x: common_vendor.o(($event) => $data.form.newPassword = $event.detail.value),
    y: common_vendor.p({
      type: $data.showNewPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    z: common_vendor.o(($event) => $data.showNewPassword = !$data.showNewPassword),
    A: $data.errors.newPassword ? 1 : "",
    B: $data.errors.newPassword
  }, $data.errors.newPassword ? {
    C: common_vendor.t($data.errors.newPassword)
  } : {}, {
    D: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    E: !$data.showNewPassword,
    F: common_vendor.o(($event) => $options.resetError("confirmNewPassword")),
    G: $data.form.confirmNewPassword,
    H: common_vendor.o(($event) => $data.form.confirmNewPassword = $event.detail.value),
    I: common_vendor.p({
      type: $data.showNewPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    J: common_vendor.o(($event) => $data.showNewPassword = !$data.showNewPassword),
    K: $data.errors.confirmNewPassword ? 1 : "",
    L: $data.errors.confirmNewPassword
  }, $data.errors.confirmNewPassword ? {
    M: common_vendor.t($data.errors.confirmNewPassword)
  } : {}, {
    N: !$data.loading
  }, !$data.loading ? {} : {
    O: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16
    })
  }, {
    P: !$options.formValid ? 1 : "",
    Q: !$options.formValid || $data.loading,
    R: common_vendor.o((...args) => $options.handleChangePassword && $options.handleChangePassword(...args)),
    S: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-febc593b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/change_password.js.map
