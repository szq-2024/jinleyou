// store/index.js
import { createStore } from 'vuex'
import user from './modules/user'
import trip from './modules/trip'

export default createStore({
	state: {
	    userInfo: {} // 初始化为空对象
	},
	modules: {
		user,
		trip
	}
})

