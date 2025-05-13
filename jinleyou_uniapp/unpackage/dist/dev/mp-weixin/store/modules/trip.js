"use strict";
const trip = {
  namespaced: true,
  state: () => ({
    // 示例数据，根据实际需求修改
    trips: [],
    currentTrip: null
  }),
  mutations: {
    // 示例 mutation
    SET_TRIPS(state, trips) {
      state.trips = trips;
    }
  },
  actions: {
    // 示例 action
    async fetchTrips({ commit }) {
      const data = await api.trip.getList();
      commit("SET_TRIPS", data);
    }
  },
  getters: {
    // 示例 getter
    tripCount: (state) => state.trips.length
  }
};
exports.trip = trip;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/trip.js.map
