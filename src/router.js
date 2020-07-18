import VueRouter from 'vue-router'

import carManage from './components/carManage.vue'
import carRent from './components/carRent.vue'

const routes = [
  {
    path: '/manage',
    name: 'carManage',
    component: carManage
  },
  {
    path: '/rent',
    name: 'carRent',
    component: carRent
  }
]

export default new VueRouter({
  routes
})

