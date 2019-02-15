import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    {
      path: '/',  // 路径
      component: () => import('./views/Index/index.vue'),  // 引入后端首页组件
      children: [
        {
          path: '',
          component: () => import('./views/Home/Home.vue')
        },
        {
          path: '/accountmanage',
          name: 'accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue')
        },
        {
          path: '/accountadd',
          name: 'accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue')
        },
        {
          path: '/passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue')
        },
        {
          path: '/goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: () => import('./views/GoodsAdd/goodsAdd.vue')
        },
        {
          path: '/salestatistics',
          name: 'salestatistics',
          component: () => import('./views/SaleStatistics/SaleStatistics.vue')
        }
      ]
    }
  ]
})
