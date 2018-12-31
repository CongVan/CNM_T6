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

// const instane  = axios.create({
//   headers: {
//     'x-access-token': store.getters.getUser?store.getters.getToken:""
//   }
// })
// Vue.prototype.$axios=instane;


Vue.use(Toasted);
Vue.use(new VueSocketIO({
  // debug: true,
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
  render: h => h(App),
  sockets: {
    refreshToken: function (token) {
      console.log(token);
      store.dispatch('refreshToken', {token:token});
    }
  },
  mounted() {
    this.$socket.close();
    this.$socket.connect();
    
  },
  
}).$mount('#app')

