import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import App from './App.vue'


//import VueSocketio from 'vue-socket.io';
//import socketio from 'socket.io-client';
//Vue.use(VueSocketio, socketio('ws://127.0.0.1:8888'));


import Screen from './components/Screen.vue'
import User from './components/User.vue'
import Test from './components/Test.vue'


import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios
// 引入路由
Vue.prototype.$names = ""

const routes = [
  {
    path: '/user', component: User, name: 'user', meta: { title: '溪南中心卫生院' },
  },
  {
    path: '/screen', component: Screen, name: 'screen', meta: { title: '溪南中心卫生院' },
  },
  {
    path: '/', component: User, name: 'user', meta: { title: '溪南中心卫生院' },
  },
  {
    path: '/test', component: Test, name: 'test', meta: { title: '溪南中心卫生院' },
  }

]

const router = new VueRouter({
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

Vue.use(VueRouter)
//引入 element
Vue.use(ElementUI);

new Vue({
  el: "#app",
  router,
  render: h => h(App)
})
