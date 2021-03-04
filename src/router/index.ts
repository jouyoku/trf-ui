import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Form from '../views/Form.vue'
import Setup from '../views/Setup.vue'
import Home0 from '../views/Home0.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/form',
    name: 'Form',
    component: Form
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup
  },
  {
    path: '/home0',
    name: 'Home0',
    component: Home0
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
