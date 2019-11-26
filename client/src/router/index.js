import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/LayoutIndex/Index'
import Register from '../views/LayoutIndex/Register.vue'
import Login from '../views/LayoutIndex/Login.vue'
import Notfound from '../views/LayoutIndex/404.vue'
import Home from '../views/Home'
import InfoShow from '../views/InfoShow'
import Requestsubmit from '../views/menu/Requestsubmit'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    component: Index,
    children:[
      { path: '', component: Home },
      { path: '/home', name: 'home', component: Home },
      { path: '/infoshow', name: 'infoshow', component: InfoShow },
      { path: '/requestsubmit', name: 'requestsubmit', component: Requestsubmit }

    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: '/404',
    component: Notfound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if(to.path =='/login'|| to.path =='/register'){
    next()
  }else{
    isLogin?next():next('/login')
  }
})
export default router
