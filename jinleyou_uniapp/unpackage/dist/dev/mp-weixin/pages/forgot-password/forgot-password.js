"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      form: {
        account: "",
        captcha: "",
        newPassword: "",
        confirmPassword: ""
      },
      errors: {
        account: "",
        captcha: "",
        newPassword: "",
        confirmPassword: ""
      },
      captchaProblem: "",
      captchaAnswer: 0,
      showPassword: false,
      loading: false
    };
  },
  computed: {
    formValid() {
      return this.form.account && this.form.captcha && this.form.newPassword && this.form.confirmPassword && !Object.values(this.errors).some((err) => err);
    }
  },
  created() {
    this.generateMathProblem();
  },
  methods: {
    generateMathProblem() {
      let num1, num2, operator;
      do {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() < 0.5 ? "+" : "-";
        if (operator === "-" && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
      } while (operator === "-" && num1 - num2 < 0);
      this.captchaProblem = `${num1} ${operator} ${num2} = ?`;
      this.captchaAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    },
    validate() {
      let valid = true;
      if (!this.form.account.trim()) {
        this.errors.account = "请输入用户名或手机号";
        valid = false;
      } else if (!/^(\w{4,20}|1[3-9]\d{9})$/.test(this.form.account)) {
        this.errors.account = "格式不正确";
        valid = false;
      }
      if (!this.form.captcha) {
        this.errors.captcha = "请输入验证码";
        valid = false;
      } else if (parseInt(this.form.captcha) !== this.captchaAnswer) {
        this.errors.captcha = "验证码错误";
        valid = false;
      }
      if (!this.form.newPassword) {
        this.errors.newPassword = "请输入新密码";
        valid = false;
      } else if (this.form.newPassword.length < 6) {
        this.errors.newPassword = "密码至少6位";
        valid = false;
      }
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "请确认密码";
        valid = false;
      } else if (this.form.confirmPassword !== this.form.newPassword) {
        this.errors.confirmPassword = "两次输入不一致";
        valid = false;
      }
      return valid;
    },
    resetError(field) {
      this.errors[field] = "";
    },
    async handleResetPassword() {
      var _a;
      if (!this.validate())
        return;
      this.loading = true;
      try {
        const res = await api_http.http.post("/api/auth/reset-password", {
          account: this.form.account,
          newPassword: this.form.newPassword,
          captchaProblem: this.captchaProblem,
          captchaAnswer: this.form.captcha
        });
        if ((res == null ? void 0 : res.code) === 200) {
          common_vendor.index.showToast({
            title: "密码重置成功",
            icon: "success",
            complete: () => {
              this.navigateTo("/pages/login/login");
            }
          });
        } else {
          const message = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.message) || "重置失败，请重试";
          common_vendor.index.showToast({ title: message, icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forgot-password/forgot-password.vue:216", "密码重置失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
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
    c: common_vendor.o(($event) => $options.resetError("account")),
    d: $data.form.account,
    e: common_vendor.o(($event) => $data.form.account = $event.detail.value),
    f: $data.errors.account ? 1 : "",
    g: $data.errors.account
  }, $data.errors.account ? {
    h: common_vendor.t($data.errors.account)
  } : {}, {
    i: common_vendor.p({
      type: "chat",
      size: "20",
      color: "#2867CE"
    }),
    j: common_vendor.t($data.captchaProblem),
    k: common_vendor.o(($event) => $options.resetError("captcha")),
    l: $data.form.captcha,
    m: common_vendor.o(($event) => $data.form.captcha = $event.detail.value),
    n: common_vendor.p({
      type: "refresh",
      size: "20",
      color: "#2867CE"
    }),
    o: common_vendor.o((...args) => $options.generateMathProblem && $options.generateMathProblem(...args)),
    p: $data.errors.captcha ? 1 : "",
    q: $data.errors.captcha
  }, $data.errors.captcha ? {
    r: common_vendor.t($data.errors.captcha)
  } : {}, {
    s: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    t: !$data.showPassword,
    v: common_vendor.o(($event) => $options.resetError("newPassword")),
    w: $data.form.newPassword,
    x: common_vendor.o(($event) => $data.form.newPassword = $event.detail.value),
    y: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    z: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
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
    E: !$data.showPassword,
    F: common_vendor.o(($event) => $options.resetError("confirmPassword")),
    G: $data.form.confirmPassword,
    H: common_vendor.o(($event) => $data.form.confirmPassword = $event.detail.value),
    I: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    J: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    K: $data.errors.confirmPassword ? 1 : "",
    L: $data.errors.confirmPassword
  }, $data.errors.confirmPassword ? {
    M: common_vendor.t($data.errors.confirmPassword)
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
    R: common_vendor.o((...args) => $options.handleResetPassword && $options.handleResetPassword(...args)),
    S: common_vendor.o(($event) => $options.navigateTo("/pages/login/login")),
    T: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-130d0c0e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forgot-password/forgot-password.js.map
