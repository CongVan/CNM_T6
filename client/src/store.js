import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import * as Cookies from 'js-cookie'
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user:null,
        jwt:null,
        isLogin:false 
    },
    getters: {
        getUser:(state)=>{return state.user},
        getToken:(state)=>{return state.jwt},
        getStatusLogin:(state)=>{return state.isLogin},
    },
    mutations: {
        "LOGINED":(state,payload)=>{
            state.user=payload.user;
            state.jwt=payload.token;
            state.isLogin=true;
        },
        "LOGOUT":(state)=>{
            state.user=null;
            state.jwt=null;
            state.isLogin=false;
        },
        "UPDATE_STATUS_LOGIN":(state,status)=>{
            state.isLogin=status;
        }
    },  
    actions: {
        logined :(context,payload)=>{
            context.commit("LOGINED",payload);
        },
        logout :(context)=>{
            context.commit("LOGOUT");
        },
        updateStatusLogin:(context,status)=>{
            context.commit("UPDATE_STATUS_LOGIN",status);
        }
    },
    plugins: [
        createPersistedState({
          storage: window.sessionStorage
        })
      ]
});
