// store/modules/user.js
export default {
  namespaced: true,
  state: () => ({
    info: uni.getStorageSync('userInfo') || {},
    token: null
  }),
	mutations: {
		SET_INFO(state, payload) {
			state.info = payload;
			uni.setStorageSync('userInfo', payload);
		},
		SET_TOKEN(state, token) {
			state.token = token
		},
		CLEAR_ALL(state) {
			state.info = null
			state.token = null
		}
	},
  actions: {
    async fetchUserInfo({ commit }) {
      try {
        const data = await api.user.getInfo()
        commit('SET_INFO', data)
        return data
      } catch (error) {
        commit('CLEAR_ALL')
        throw error
      }
    },
	async checkTokenValidity({ commit, state }) {
	    try {
	      // 示例：验证token有效性
	      await api.validateToken(state.token); // 假设存在API方法
	      // 如果有效，可能不需要额外操作
	    } catch (error) {
	      commit('CLEAR_ALL'); // 无效则清除状态
	      throw error;
	    }
	  }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    userInfo: state => state.info || {}
  }
}