import Vue from 'vue';
import Router from 'vue-router';
import RequestReceiver from './components/RequestReceiver';
import LocationIdentifier from './components/LocationIdentifier';
import RequestManagement from './components/RequestManagement';
import Driver from './components/Driver';
import Login from './components/Login';
import Config from './config';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueSession from 'vue-session';
import store from '@/store';
Vue.use(VueSession);
Vue.use(Router);
Vue.use(VueAxios, axios);
var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/dang-nhap',
      name: 'Login',
      component: Login,
      meta: {
        auth: false,
        title: "Đăng nhập"
      }
    },
    {
      path: '/ghi-nhan-yeu-cau',
      name: 'RequestReceiver',
      component: RequestReceiver,
      meta: {
        auth: true,
        title: "App 1 - Ghi nhận yêu cầu"
      },

    },
    {
      path: '/xac-nhan-vi-tri',
      name: 'LocationIdentifier',
      component: LocationIdentifier,
      meta: {
        auth: true,
        title: "App 2 - Xác nhận vị trí"
      }
    },
    {
      path: '/quan-ly-yeu-cau',
      name: 'RequestManagement',
      component: RequestManagement,
      meta: {
        auth: true,
        title: "App 3 - Quản lý yêu cầu"
      }
    },
    {
      path: '/tai-xe',
      name: 'Driver',
      component: Driver,
      meta: {
        auth: true,
        title: "App 4 - Tài xế"
      }
    },

  ]
});
router.beforeEach((to, from, next) => {
  console.log(to.name);
  if (to.matched.some(record => record.meta.auth)) {
    var jwt = store.getters.getToken;
   var refreshToken=store.getters.getRefreshToken;
    var suser = store.getters.getUser;
    console.log('router', suser);
    // console.log('store', jwt);
    if (jwt == null) {
      console.log('CHECK LOGIN',suser,to.name);
      store.dispatch("logout");
      next({
        name: 'Login',
        path: '/dang-nhap',
        params: { 'nextUrl': to.fullPath }
      })
    } else {
      
      Vue.axios.get(`${Config.hostAPI}/driver/valid-token`,
        {
          headers: {
            'x-access-token': jwt,
            'x-refresh-token': refreshToken
          }
        }).then((res) => {
          console.log('LOGIN',res.data);
          if (res.data.status == 1) {
            var user = suser;
            if(res.data.jwt){
              store.dispatch("refreshToken", res.data.jwt);
            }
            
            
            next(user.role == 1 && to.name == "RequestReceiver" ? true :
              user.role == 2 && to.name == "LocationIdentifier" ? true :
                user.role == 3 && to.name == "RequestManagement" ? true :
                  user.role == 4 && to.name == "Driver" ? true : false);
                  document.title=to.meta.title;
          } else {
            // console.log('CHECK LOGIN');
            next({
              name: 'Login',
              path: '/dang-nhap',
              // params: { 'nextUrl': to.fullPath }
            })
          }
        }).catch(err => {
          // console.log('role: ',roleRouter(user.role));
          console.log(err);
          next(false);

        });
    }
  } else {
    if(to.name=='Login'){
      store.dispatch("logout");
    }
    // var user = JSON.parse(localStorage.getItem('user'));
    next();
  }
});

export default router;