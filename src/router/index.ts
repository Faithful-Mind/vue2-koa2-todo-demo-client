import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/todolist',
    // route level code-splitting
    // this generates a separate chunk (todolist.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "todolist" */ '../views/TodoList.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('demo-token');
  if (to.path === '/') { // 如果是跳转到登录页的
    if (token !== 'null' && token != null) {
      next('/todolist'); // 如果有token就转向todolist不返回登录页
    }
    next(); // 否则跳转回登录页
  } else if (token !== 'null' && token != null) {
    // 全局设定header的token验证，注意Bearer后有个空格
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    next(); // 如果有token就正常转向
  } else {
    next('/'); // 否则跳转回登录页
  }
});

export default router;
