import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueRouter from 'vue-router'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';


Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(iView)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
