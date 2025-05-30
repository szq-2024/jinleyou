// store/index.js
import Vue from 'vue'
import { createStore } from 'vuex'
import user from './modules/user'

export default createStore({
	state: {
	    userInfo: {} // 初始化为空对象
	},
	modules: {
		user
	}
})

