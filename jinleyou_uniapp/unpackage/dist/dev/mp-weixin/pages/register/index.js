"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        phone: "",
        password: "",
        captcha: ""
      },
      errors: {
        username: "",
        phone: "",
        password: "",
        captcha: ""
      },
      captchaProblem: "",
      captchaAnswer: 0,
      showPassword: false,
      agreed: false,
      loading: false
    };
  },
  computed: {
    formValid() {
      return this.form.username && this.form.phone && this.form.password && this.form.captcha && !Object.values(this.errors).some((err) => err) && this.agreed;
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
    // 验证表单
    validate() {
      let valid = true;
      if (!this.form.username.trim()) {
        this.errors.username = "请输入用户名";
        valid = false;
      } else if (!/^[\w\u4e00-\u9fa5]{4,20}$/.test(this.form.username)) {
        this.errors.username = "用户名格式不正确";
        valid = false;
      }
      if (!this.form.phone) {
        this.errors.phone = "请输入手机号";
        valid = false;
      } else if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        this.errors.phone = "手机号格式不正确";
        valid = false;
      }
      if (!this.form.password) {
        this.errors.password = "请输入密码";
        valid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "密码长度至少6位";
        valid = false;
      }
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "请确认密码";
        valid = false;
      } else if (this.form.confirmPassword !== this.form.password) {
        this.errors.confirmPassword = "两次输入的密码不一致";
        valid = false;
      }
      if (!this.form.captcha) {
        this.errors.captcha = "请输入验证码";
        valid = false;
      } else if (!/^\d+$/.test(this.form.captcha)) {
        this.errors.captcha = "验证码必须为数字";
        valid = false;
      } else if (parseInt(this.form.captcha) !== this.captchaAnswer) {
        this.errors.captcha = "验证码错误";
        valid = false;
      }
      return valid;
    },
    // 重置错误
    resetError(field) {
      this.errors[field] = "";
    },
    // 协议勾选
    toggleAgreement(e) {
      this.agreed = e.detail.value.length > 0;
    },
    // 处理注册
    async handleRegister() {
      var _a, _b;
      if (!this.validate())
        return;
      this.loading = true;
      try {
        const res = await api_http.http.post("/api/auth/register", {
          username: this.form.username,
          phone: this.form.phone,
          password: this.form.password,
          captchaProblem: this.captchaProblem,
          captchaAnswer: this.form.captcha
        });
        if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.code) === 200) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success",
            complete: () => {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          });
        } else {
          const message = ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) || "注册成功";
          common_vendor.index.showToast({ title: message, icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/register/index.vue:255", "注册失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 显示协议
    showAgreement() {
      common_vendor.index.navigateTo({ url: "/pages/webview?url=" + encodeURIComponent("https://localhost:3000/agreement") });
    },
    // 显示隐私政策
    showPrivacy() {
      common_vendor.index.navigateTo({ url: "/pages/webview?url=" + encodeURIComponent("https://localhost:3000/privacy") });
    },
    // 通用跳转
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
    c: common_vendor.o(($event) => $options.resetError("username")),
    d: $data.form.username,
    e: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    f: $data.errors.username ? 1 : "",
    g: $data.errors.username
  }, $data.errors.username ? {
    h: common_vendor.t($data.errors.username)
  } : {}, {
    i: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#2867CE"
    }),
    j: common_vendor.o(($event) => $options.resetError("phone")),
    k: $data.form.phone,
    l: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    m: $data.errors.phone ? 1 : "",
    n: $data.errors.phone
  }, $data.errors.phone ? {
    o: common_vendor.t($data.errors.phone)
  } : {}, {
    p: common_vendor.p({
      type: "chat",
      size: "20",
      color: "#2867CE"
    }),
    q: common_vendor.t($data.captchaProblem),
    r: common_vendor.o(($event) => $options.resetError("captcha")),
    s: $data.form.captcha,
    t: common_vendor.o(($event) => $data.form.captcha = $event.detail.value),
    v: common_vendor.p({
      type: "refresh",
      size: "20",
      color: "#2867CE"
    }),
    w: common_vendor.o((...args) => $options.generateMathProblem && $options.generateMathProblem(...args)),
    x: $data.errors.captcha ? 1 : "",
    y: $data.errors.captcha
  }, $data.errors.captcha ? {
    z: common_vendor.t($data.errors.captcha)
  } : {}, {
    A: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    B: !$data.showPassword,
    C: common_vendor.o(($event) => $options.resetError("password")),
    D: $data.form.password,
    E: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    F: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    G: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    H: $data.errors.password ? 1 : "",
    I: $data.errors.password
  }, $data.errors.password ? {
    J: common_vendor.t($data.errors.password)
  } : {}, {
    K: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    L: !$data.showPassword,
    M: common_vendor.o(($event) => $options.resetError("confirmPassword")),
    N: $data.form.confirmPassword,
    O: common_vendor.o(($event) => $data.form.confirmPassword = $event.detail.value),
    P: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    Q: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    R: $data.errors.confirmPassword ? 1 : "",
    S: $data.errors.confirmPassword
  }, $data.errors.confirmPassword ? {
    T: common_vendor.t($data.errors.confirmPassword)
  } : {}, {
    U: !$data.loading
  }, !$data.loading ? {} : {
    V: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16
    })
  }, {
    W: !$options.formValid ? 1 : "",
    X: !$options.formValid || $data.loading,
    Y: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    Z: common_vendor.o(($event) => $options.navigateTo("/pages/login/login")),
    aa: $data.agreed,
    ab: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args)),
    ac: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    ad: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    ae: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-46a64346"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/index.js.map
