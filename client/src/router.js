import Vue from 'vue';
import Router from 'vue-router';
import RequestReceiver from '@/components/RequestReceiver';
import LocationIdentifier from '@/components/LocationIdentifier';
import RequestManagement from '@/components/RequestManagement';
import Driver from '@/components/Driver';
import Login from '@/components/Login';
// import Config from './config';

Vue.use(Router);

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/dang-nhap',
      name: 'Login',
      component: Login,
      
    },
    {
      path: '/ghi-nhan-yeu-cau',
      name: 'RequestReceiver',
      component: RequestReceiver,
      
    },
    {
      path: '/xac-nhan-vi-tri',
      name: 'LocationIdentifier',
      component: LocationIdentifier,
      
    },
    {
      path: '/quan-ly-yeu-cau',
      name: 'RequestManagement',
      component: RequestManagement,
      
    },
    {
      path: '/tai-xe',
      name: 'Driver',
      component: Driver,
      
    },

  ]
});
export default router;