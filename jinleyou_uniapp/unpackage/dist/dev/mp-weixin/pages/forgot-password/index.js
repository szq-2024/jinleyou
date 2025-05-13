"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      form: {
        phone: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      errors: {
        phone: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      showPassword: false,
      countdown: 0,
      loading: false,
      timer: null
    };
  },
  computed: {
    canGetCode() {
      return /^1[3-9]\d{9}$/.test(this.form.phone);
    },
    formValid() {
      return this.form.phone && this.form.code && this.form.password && this.form.confirmPassword && !this.errors.phone && !this.errors.code && !this.errors.password && !this.errors.confirmPassword;
    }
  },
  methods: {
    validate() {
      let valid = true;
      if (!this.form.phone) {
        this.errors.phone = "请输入手机号";
        valid = false;
      } else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        this.errors.phone = "手机号格式不正确";
        valid = false;
      }
      if (!this.form.code) {
        this.errors.code = "请输入验证码";
        valid = false;
      } else if (!/^\d{6}$/.test(this.form.code)) {
        this.errors.code = "验证码格式不正确";
        valid = false;
      }
      if (!this.form.password) {
        this.errors.password = "请输入新密码";
        valid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "密码长度至少6位";
        valid = false;
      }
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "请确认新密码";
        valid = false;
      } else if (this.form.confirmPassword !== this.form.password) {
        this.errors.confirmPassword = "两次输入的密码不一致";
        valid = false;
      }
      return valid;
    },
    resetError(field) {
      this.errors[field] = "";
    },
    async sendSmsCode() {
      if (!this.canGetCode)
        return;
      try {
        const res = await common_vendor.index.request({
          url: "/api/auth/send-sms",
          method: "POST",
          data: {
            phone: this.form.phone,
            type: "reset-password"
          }
        });
        if (res.data.code === 200) {
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
          this.startCountdown();
        } else {
          common_vendor.index.showToast({
            title: res.data.message || "发送失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forgot-password/index.vue:197", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "发送失败，请稍后重试",
          icon: "none"
        });
      }
    },
    startCountdown() {
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          return;
        }
        this.countdown--;
      }, 1e3);
    },
    async handleResetPassword() {
      if (!this.validate())
        return;
      this.loading = true;
      try {
        const res = await common_vendor.index.request({
          url: "/api/auth/reset-password",
          method: "POST",
          data: {
            phone: this.form.phone,
            code: this.form.code,
            password: this.form.password
          }
        });
        if (res.data.code === 200) {
          common_vendor.index.showToast({
            title: "密码重置成功",
            icon: "success",
            complete: () => {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          });
        } else {
          common_vendor.index.showToast({
            title: res.data.message || "重置失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forgot-password/index.vue:246", "重置密码失败:", error);
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
  },
  beforeUnmount() {
    if (this.timer)
      clearInterval(this.timer);
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
      type: "phone",
      size: "20",
      color: "#999"
    }),
    c: common_vendor.o(($event) => $options.resetError("phone")),
    d: $data.form.phone,
    e: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    f: $data.errors.phone ? 1 : "",
    g: $data.errors.phone
  }, $data.errors.phone ? {
    h: common_vendor.t($data.errors.phone)
  } : {}, {
    i: common_vendor.p({
      type: "shield",
      size: "20",
      color: "#999"
    }),
    j: common_vendor.o(($event) => $options.resetError("code")),
    k: $data.form.code,
    l: common_vendor.o(($event) => $data.form.code = $event.detail.value),
    m: common_vendor.t($data.countdown > 0 ? `${$data.countdown}s后重试` : "获取验证码"),
    n: $data.countdown > 0 || !$options.canGetCode,
    o: common_vendor.o((...args) => $options.sendSmsCode && $options.sendSmsCode(...args)),
    p: $data.errors.code ? 1 : "",
    q: $data.errors.code
  }, $data.errors.code ? {
    r: common_vendor.t($data.errors.code)
  } : {}, {
    s: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    t: common_vendor.o(($event) => $options.resetError("password")),
    v: $data.form.password,
    w: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    x: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#999"
    }),
    y: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    z: $data.errors.password ? 1 : "",
    A: $data.errors.password
  }, $data.errors.password ? {
    B: common_vendor.t($data.errors.password)
  } : {}, {
    C: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    D: common_vendor.o(($event) => $options.resetError("confirmPassword")),
    E: $data.form.confirmPassword,
    F: common_vendor.o(($event) => $data.form.confirmPassword = $event.detail.value),
    G: $data.errors.confirmPassword ? 1 : "",
    H: $data.errors.confirmPassword
  }, $data.errors.confirmPassword ? {
    I: common_vendor.t($data.errors.confirmPassword)
  } : {}, {
    J: !$data.loading
  }, !$data.loading ? {} : {
    K: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16
    })
  }, {
    L: !$options.formValid ? 1 : "",
    M: !$options.formValid || $data.loading,
    N: common_vendor.o((...args) => $options.handleResetPassword && $options.handleResetPassword(...args)),
    O: common_vendor.o(($event) => $options.navigateTo("/pages/login/login")),
    P: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c1f29b51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forgot-password/index.js.map
