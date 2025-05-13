// store/modules/trip.js
export default {
  namespaced: true,
  state: () => ({
    // 示例数据，根据实际需求修改
    trips: [],
    currentTrip: null
  }),
  mutations: {
    // 示例 mutation
    SET_TRIPS(state, trips) {
      state.trips = trips
    }
  },
  actions: {
    // 示例 action
    async fetchTrips({ commit }) {
      const data = await api.trip.getList() // 替换为实际接口调用
      commit('SET_TRIPS', data)
    }
  },
  getters: {
    // 示例 getter
    tripCount: state => state.trips.length
  }
}