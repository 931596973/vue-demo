import VueRouter from 'vue-router'

import carManage from './components/carManage.vue'
import carRent from './components/carRent.vue'
import index from './components/index.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
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

