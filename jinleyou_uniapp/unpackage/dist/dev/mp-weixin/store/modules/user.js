"use strict";
const common_vendor = require("../../common/vendor.js");
const user = {
  namespaced: true,
  state: () => ({
    info: common_vendor.index.getStorageSync("userInfo") || {},
    token: null
  }),
  mutations: {
    SET_INFO(state, payload) {
      state.info = payload;
      common_vendor.index.setStorageSync("userInfo", payload);
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    CLEAR_ALL(state) {
      state.info = null;
      state.token = null;
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      try {
        const data = await api.user.getInfo();
        commit("SET_INFO", data);
        return data;
      } catch (error) {
        commit("CLEAR_ALL");
        throw error;
      }
    },
    async checkTokenValidity({ commit, state }) {
      try {
        await api.validateToken(state.token);
      } catch (error) {
        commit("CLEAR_ALL");
        throw error;
      }
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.info || {}
  }
};
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/user.js.map
