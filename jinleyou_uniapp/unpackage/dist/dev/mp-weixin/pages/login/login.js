"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      errors: {
        username: "",
        password: ""
      },
      showPassword: false,
      rememberMe: false,
      agreed: true,
      loading: false
    };
  },
  computed: {
    formValid() {
      return this.form.username && this.form.password && !this.errors.username && !this.errors.password && this.agreed;
    }
  },
  onLoad() {
    this.loadRememberedAccount();
  },
  methods: {
    ...common_vendor.mapMutations("user", ["SET_INFO"]),
    // 初始化记住的账号
    loadRememberedAccount() {
      const account = common_vendor.index.getStorageSync("rememberedAccount");
      if (account) {
        this.form = { ...account };
        this.rememberMe = true;
      }
    },
    // 验证表单
    validate() {
      let valid = true;
      const { username, password } = this.form;
      if (!username.trim()) {
        this.errors.username = "请输入用户名/手机号";
        valid = false;
      } else if (!/^[\w\u4e00-\u9fa5]{3,20}$/.test(username)) {
        this.errors.username = "用户名格式不正确";
        valid = false;
      }
      if (!password) {
        this.errors.password = "请输入密码";
        valid = false;
      } else if (password.length < 6) {
        this.errors.password = "密码长度至少6位";
        valid = false;
      }
      return valid;
    },
    // 重置错误
    resetError(field) {
      this.errors[field] = "";
    },
    // 记住账号
    toggleRemember(e) {
      this.rememberMe = e.detail.value.length > 0;
    },
    // 协议勾选
    toggleAgreement(e) {
      this.agreed = e.detail.value.length > 0;
    },
    // 处理登录
    async handleLogin() {
      if (!this.validate())
        return;
      this.loading = true;
      try {
        const res = await api_http.http.post("/api/auth/login", {
          account: this.form.username,
          password: this.form.password
        });
        common_vendor.index.__f__("log", "at pages/login/login.vue:190", "🔍 完整响应结构:", JSON.stringify(res, null, 2));
        common_vendor.index.setStorageSync("token", res.data.token);
        this.SET_INFO(res.data.user);
        common_vendor.index.setStorageSync("userId", res.data.user.userId);
        common_vendor.index.setStorageSync("avatar", res.data.user.avatar);
        const expiresIn = res.data.expires_in;
        const expireTime = Date.now() + expiresIn * 1e3;
        common_vendor.index.setStorageSync("tokenExpire", expireTime);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1500,
          success: () => {
            common_vendor.index.switchTab({
              url: "/pages/index/index",
              success: () => {
                common_vendor.index.__f__("log", "at pages/login/login.vue:212", "路由跳转成功");
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/login/login.vue:215", "路由跳转失败:", err);
                common_vendor.index.reLaunch({
                  url: "/pages/index/index"
                });
              }
            });
          }
        });
        if (this.rememberMe) {
          common_vendor.index.setStorageSync("rememberedAccount", this.form);
        } else {
          common_vendor.index.removeStorageSync("rememberedAccount");
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 微信登录
    onWechatLogin(e) {
      common_vendor.index.__f__("log", "at pages/login/login.vue:245", "微信登录:", e);
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
      type: "locked",
      size: "20",
      color: "#2867CE"
    }),
    j: !$data.showPassword,
    k: common_vendor.o(($event) => $options.resetError("password")),
    l: $data.form.password,
    m: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    n: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#2867CE"
    }),
    o: common_vendor.o(($event) => $data.showPassword = !$data.showPassword),
    p: $data.errors.password ? 1 : "",
    q: $data.errors.password
  }, $data.errors.password ? {
    r: common_vendor.t($data.errors.password)
  } : {}, {
    s: $data.rememberMe,
    t: common_vendor.o((...args) => $options.toggleRemember && $options.toggleRemember(...args)),
    v: common_vendor.o(($event) => $options.navigateTo("/pages/forgot-password/index")),
    w: !$data.loading
  }, !$data.loading ? {} : {
    x: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16
    })
  }, {
    y: !$options.formValid ? 1 : "",
    z: !$options.formValid || $data.loading,
    A: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    B: common_vendor.o(($event) => $options.navigateTo("/pages/register/index")),
    C: common_vendor.p({
      type: "weixin",
      size: "24",
      color: "#09BB07"
    }),
    D: common_vendor.o((...args) => $options.onWechatLogin && $options.onWechatLogin(...args)),
    E: $data.agreed,
    F: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args)),
    G: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    H: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    I: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
