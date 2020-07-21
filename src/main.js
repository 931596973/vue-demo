import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueRouter from 'vue-router'
import router from './router'

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
