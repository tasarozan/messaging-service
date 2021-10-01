import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../views/search.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import Profile from '../views/profile.vue'
import Messenger from '../views/messenger.vue'

Vue.use(VueRouter)

export default function init(store) {
  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'Search',
        component: Search,
      },
      {
        path: '/register',
        name: 'register',
        component: Register,
        beforeEnter(to, from, next) {
          if (store.state.user) return next('/')
          return next()
        },
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter(to, from, next) {
          if (store.state.user) return next('/')
          return next()
        },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: '/messenger',
        name: 'Messenger',
        component: Messenger,
      },
    ],
  })
}
