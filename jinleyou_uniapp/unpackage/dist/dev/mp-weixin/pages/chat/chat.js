"use strict";
const common_vendor = require("../../common/vendor.js");
const api_http = require("../../api/http.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const currentUserId = common_vendor.ref(Number(common_vendor.index.getStorageSync("userId")));
    const currentUserAvatar = common_vendor.ref("");
    const targetUserId = common_vendor.ref(null);
    const messages = common_vendor.ref([]);
    const inputValue = common_vendor.ref("");
    const scrollTop = common_vendor.ref(0);
    const autoScroll = common_vendor.ref(true);
    const systemInfo = common_vendor.ref({});
    const formatTime = (time) => {
      return common_vendor.dayjs(time).format("HH:mm");
    };
    const handleScroll = (e) => {
      const { scrollHeight, scrollTop: st, deltaY } = e.detail;
      autoScroll.value = st + deltaY >= scrollHeight - 500;
    };
    const scrollToBottom = async (animate = true) => {
      if (!autoScroll.value)
        return;
      await common_vendor.nextTick$1();
      const query = common_vendor.index.createSelectorQuery();
      query.select("#bottom-anchor").boundingClientRect();
      query.select(".chat-scroll").boundingClientRect();
      query.exec((res) => {
        if (res[0] && res[1]) {
          scrollTop.value = res[0].top - res[1].top + scrollTop.value;
          setTimeout(() => autoScroll.value = true, 500);
        }
      });
    };
    const loadMessages = async () => {
      try {
        const res = await api_http.http.get(`/api/chat/${targetUserId.value}`);
        messages.value = res.data.map((msg) => ({
          ...msg,
          createdAt: msg.createdAt,
          senderAvatar: msg.senderAvatar || "/static/default-avatar.png"
        }));
        await scrollToBottom(false);
      } catch (e) {
        common_vendor.index.showToast({ title: "加载消息失败", icon: "none" });
      }
    };
    const sendMessage = async () => {
      if (!inputValue.value.trim())
        return;
      try {
        const res = await api_http.http.post("/api/chat", {
          receiverId: targetUserId.value,
          content: inputValue.value
        });
        messages.value.push({
          id: res.id,
          senderId: currentUserId.value,
          content: inputValue.value,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          senderAvatar: currentUserAvatar.value
        });
        inputValue.value = "";
        await scrollToBottom();
      } catch (e) {
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
      }
    };
    const markAsRead = async () => {
      try {
        await api_http.http.put(`/api/chat/${targetUserId.value}/mark-as-read`);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:133", "标记已读失败", e);
      }
    };
    common_vendor.onLoad(async (options) => {
      targetUserId.value = options.userId;
      systemInfo.value = await common_vendor.index.getSystemInfoSync();
      await loadMessages();
      markAsRead();
    });
    let keyboardHeight = 0;
    common_vendor.index.onKeyboardHeightChange((res) => {
      keyboardHeight = res.height;
      systemInfo.value.windowHeight - (keyboardHeight ? 190 : 120);
      scrollTop.value += keyboardHeight ? -50 : 50;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messages.value, (msg, index, i0) => {
          return common_vendor.e({
            a: msg.senderId !== currentUserId.value
          }, msg.senderId !== currentUserId.value ? {
            b: msg.senderAvatar || "/static/default-avatar.png"
          } : {}, {
            c: common_vendor.t(msg.content),
            d: msg.senderId === currentUserId.value ? 1 : "",
            e: common_vendor.t(formatTime(msg.createdAt)),
            f: msg.id,
            g: msg.senderId === currentUserId.value ? 1 : ""
          });
        }),
        b: scrollTop.value,
        c: common_vendor.o(handleScroll),
        d: common_vendor.o(sendMessage),
        e: inputValue.value,
        f: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        g: common_vendor.o(sendMessage),
        h: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
