"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const _sfc_main = {
  __name: "my_messages",
  setup(__props) {
    const chatList = common_vendor.ref([]);
    common_vendor.onLoad(async () => {
      try {
        const res = await api_http.http.get("/api/chat/contacts");
        chatList.value = res.data.map((item) => ({
          userId: item.userId,
          nickname: item.nickname,
          avatar: item.avatar,
          lastContent: item.lastContent,
          lastTime: item.lastTime,
          unread: item.unreadCount
        }));
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    });
    const formatTime = (time) => {
      return common_vendor.dayjs(time).format("MM-DD HH:mm");
    };
    const enterChat = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?userId=${item.userId}&title=${encodeURIComponent(item.nickname)}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(chatList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar || "/static/default-avatar.png",
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(formatTime(item.lastTime)),
            d: common_vendor.t(item.lastContent),
            e: item.unread > 0
          }, item.unread > 0 ? {
            f: common_vendor.t(item.unread > 99 ? "99+" : item.unread)
          } : {}, {
            g: item.userId,
            h: common_vendor.o(($event) => enterChat(item), item.userId)
          });
        }),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b138ce5f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my_messages.js.map
