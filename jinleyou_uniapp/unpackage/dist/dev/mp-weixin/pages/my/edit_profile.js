"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const _sfc_main = {
  data() {
    return {
      form: {
        avatar: "",
        nickname: "",
        gender: 0,
        bio: ""
      },
      originalForm: {},
      errors: {
        nickname: ""
      },
      genderOptions: [
        { label: "保密", value: 0 },
        { label: "男", value: 1 },
        { label: "女", value: 2 }
      ],
      uploading: false,
      uploadProgress: 0,
      saving: false,
      loadingText: {
        contentdown: "保存中",
        contentrefresh: "保存中",
        contentnomore: "保存中"
      }
    };
  },
  computed: {
    ...common_vendor.mapState("user", ["info"]),
    // 映射 user 模块的 info 状态
    userInfo() {
      return this.info || {};
    },
    // 检查表单是否有变化
    formChanged() {
      return JSON.stringify(this.form) !== JSON.stringify(this.originalForm);
    },
    // 检查是否有错误
    hasErrors() {
      return this.errors.nickname !== "";
    }
  },
  onLoad() {
    this.initFormData();
  },
  onShow() {
    if (!Object.keys(this.userInfo).length) {
      this.getUserInfo();
    }
  },
  methods: {
    ...common_vendor.mapMutations("user", ["SET_INFO"]),
    // 初始化表单数据
    initFormData() {
      this.form = {
        avatar: this.userInfo.avatar || "",
        nickname: this.userInfo.nickname || "",
        gender: this.userInfo.gender ?? 0,
        bio: this.userInfo.bio || ""
      };
      this.originalForm = JSON.parse(JSON.stringify(this.form));
    },
    // 更换头像
    async changeAvatar() {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          extension: ["jpg", "jpeg", "png", "gif"]
        });
        if (res.tempFilePaths && res.tempFilePaths.length) {
          this.uploading = true;
          this.uploadProgress = 0;
          try {
            const uploadRes = await common_vendor.index.uploadFile({
              url: `${api_http.ENV_CONFIG["development"]}/api/user/upload`,
              filePath: res.tempFilePaths[0],
              name: "file",
              header: {
                Authorization: `Bearer ${common_vendor.index.getStorageSync("token")}`
              }
            });
            if (uploadRes.statusCode === 200) {
              const data = JSON.parse(uploadRes.data);
              if (data.code === 200) {
                const baseURL = api_http.ENV_CONFIG["development"];
                this.form.avatar = baseURL + data.url;
              } else {
                common_vendor.index.showToast({ title: data.msg || "上传失败", icon: "none" });
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/my/edit_profile.vue:180", "上传失败:", error);
            common_vendor.index.showToast({ title: "头像上传失败", icon: "none" });
          } finally {
            this.uploading = false;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/edit_profile.vue:187", "选择图片失败:", error);
        this.uploading = false;
      }
    },
    // 性别选择
    onGenderChange(e) {
      this.form.gender = e.detail.value;
    },
    // 验证昵称
    validateNickname() {
      if (!this.form.nickname) {
        this.errors.nickname = "昵称不能为空";
      } else if (this.form.nickname.length < 2) {
        this.errors.nickname = "昵称太短";
      } else {
        this.errors.nickname = "";
      }
    },
    // 保存资料
    async saveProfile() {
      if (this.saving || !this.formChanged || this.hasErrors)
        return;
      this.saving = true;
      try {
        let updateData = { ...this.form };
        const { code, message } = await api_http.http.post("/api/user/update", updateData);
        if (code === 200) {
          common_vendor.index.showToast({ title: "修改成功", icon: "success" });
          this.SET_INFO(this.form);
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        } else {
          common_vendor.index.showToast({ title: message, icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/edit_profile.vue:225", "保存失败:", error);
        common_vendor.index.showToast({ title: "保存失败，请重试", icon: "none" });
      } finally {
        this.saving = false;
      }
    },
    goBack() {
      if (this.formChanged) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您有未保存的修改，确定要离开吗？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateBack();
            }
          }
        });
      } else {
        common_vendor.index.navigateBack();
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
    a: $data.form.avatar || "/static/default-avatar.png",
    b: common_vendor.p({
      type: "camera-filled",
      size: "24",
      color: "#fff"
    }),
    c: $data.uploading
  }, $data.uploading ? {
    d: common_vendor.t($data.uploadProgress)
  } : {}, {
    e: common_vendor.o((...args) => $options.changeAvatar && $options.changeAvatar(...args)),
    f: common_vendor.o((...args) => $options.validateNickname && $options.validateNickname(...args)),
    g: $data.form.nickname,
    h: common_vendor.o(($event) => $data.form.nickname = $event.detail.value),
    i: $data.errors.nickname
  }, $data.errors.nickname ? {
    j: common_vendor.t($data.errors.nickname)
  } : {}, {
    k: common_vendor.t($data.genderOptions[$data.form.gender].label || "请选择性别"),
    l: $data.genderOptions,
    m: common_vendor.o((...args) => $options.onGenderChange && $options.onGenderChange(...args)),
    n: $data.form.bio,
    o: common_vendor.o(($event) => $data.form.bio = $event.detail.value),
    p: common_vendor.t($data.form.bio.length),
    q: !$data.saving
  }, !$data.saving ? {} : {
    r: common_vendor.p({
      status: "loading",
      ["icon-size"]: 16,
      ["content-text"]: $data.loadingText
    })
  }, {
    s: !$options.formChanged || $options.hasErrors ? 1 : "",
    t: !$options.formChanged || $options.hasErrors || $data.saving,
    v: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    w: common_vendor.gei(_ctx, "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-decdb119"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/edit_profile.js.map
