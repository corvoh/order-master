import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
import VueRouter from 'vue-router'
// 引入element-UI
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8081'
axios.interceptors.request.use(config => {
  console.log(config)
  // config.headers.Token = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.use(Element)
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
