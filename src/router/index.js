import Vue from 'vue'
// import Login from '../views/login.vue'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'
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
      component: Home,
      children:[{path:'/users',component:Users}]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
