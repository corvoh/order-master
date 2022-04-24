import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routes'
import Home from '../views/Home'
import Login from '../views/Login'
import Index from '../views/import/Index'
import Borad from '../views/import/Borad'
import Register from '../views/import/Register'
import Room from '../views/import/Room'
import Drug from '../views/import/Drug'
import Charge from '../views/import/Charge'
import UserCenter from '../views/import/UserCenter'
import Patient from '../views/import/role/Patient'
import Doctor from '../views/import/role/Doctor'
import Admin from '../views/import/role/Admin'
import Role from '../views/import/Role'
import User from '../views/import/User'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'index',
        name: 'Index',
        component: Index
      },
      {
        path: 'borad',
        name: 'Borad',
        component: Borad
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'room',
        name: 'Room',
        component: Room
      },
      {
        path: 'drug',
        name: 'Drug',
        component: Drug
      },
      {
        path: 'charge',
        name: 'Charge',
        component: Charge
      },
      {
        path: 'admin',
        name: 'Admin',
        component: Admin
      },
      {
        path: 'doctor',
        name: 'Doctor',
        component: Doctor
      },
      {
        path: 'patient',
        name: 'Patient',
        component: Patient
      },
      {
        path: 'userCenter',
        name: 'UserCenter',
        component: UserCenter
      },
      {
        path:'role',
        name:'Role',
        component:Role
      },
      {
        path:'user',
        name:'User',
        component:User
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

/* //挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
}) */

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
