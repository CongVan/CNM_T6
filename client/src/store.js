import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:null,
    jwt:null,
    isLogin:false 
  },
  getters: {
    getUser:(state)=>{return state.user},
},
  mutations: {

  },
  actions: {

  }
})
