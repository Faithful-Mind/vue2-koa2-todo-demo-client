import Vue from 'vue';
import VueRouter from 'vue-router';
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

export default router;
