import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Toasted from 'vue-toasted';
import Config from './config';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false
Vue.use(VueAxios, axios);
Vue.use(Toasted);
Vue.use(new VueSocketIO({
  debug: true,
  connection: Config.hostAPI,
  // vuex: {
  //     store,
  //     actionPrefix: 'SOCKET_',
  //     mutationPrefix: 'SOCKET_'
  // }
}));
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

