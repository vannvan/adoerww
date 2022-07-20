import routerList from './auto-register-route'
import Layout from '@/layout/Layout.vue'

export default [
  {
    path: '*',
    component: () => import('@/pages/HelloWorld.vue')
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: routerList
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue')
  }
]
