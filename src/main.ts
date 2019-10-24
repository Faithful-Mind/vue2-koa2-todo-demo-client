import Vue from 'vue';
import ElementUI from 'element-ui'; // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import router from './router';

Vue.use(ElementUI); // Vue全局使用
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
