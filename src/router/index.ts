import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import axios from 'axios';

import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  },
  {
    path: '/todolist',
    // route level code-splitting
    // this generates a separate chunk (todolist.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "todolist" */ '../views/TodoList.vue'),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('demo-token');
  if (to.meta.requiresAuth) {
    if (token) { // 有token才正常转向并放入Header
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      next();
    } else {
      next('/');
    }
  } else if (to.path === '/' && token) {
    next('/todolist');
  } else {
    next();
  }
});

export default router;
