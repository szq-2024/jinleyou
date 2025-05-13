import App from './App'
import './mock/mock.js'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter) // 扩展插件
// #ifndef VUE3
import Vue from 'vue'
import uviewPlus from 'uview-plus'
import './uni.promisify.adaptor'
import api from './api'
import store from './store';


Vue.prototype.$api = api
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import store from './store/index.js'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif