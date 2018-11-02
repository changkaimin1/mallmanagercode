import Vue from 'vue'
// import Login from '../views/login.vue'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
// 导入 HttpTool --> 也就是axios已经挂在了Vue的原型上
import HttpTool from '@/plugins/http.js'

import Router from 'vue-router'

Vue.use(HttpTool)
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
