import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import axios from 'axios';

import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = sessionStorage.getItem('demo-token');
      if (token !== 'null' && token != null) {
        next('/todolist'); // 如果有token就转向todolist不返回登录页
      } else {
        next();
      }
    },
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
    beforeEnter: (to, from, next) => {
      const token = sessionStorage.getItem('demo-token');
      if (token !== 'null' && token != null) { // 有token才正常转向并放入Header
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        next();
      } else {
        next('/');
      }
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
