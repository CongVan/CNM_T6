<template>
<div id="app">
    <!--Navbar-->
    <nav class="navbar navbar-expand-lg navbar-dark  indigo darken-2">
        <!-- Navbar brand -->
        <a
        class="navbar-brand active"
        href="#"
      >
        Danh sách APP
      </a>

        <!-- Collapse button -->
        <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#basicExampleNav"
        aria-controls="basicExampleNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>

        <!-- Collapsible content -->
        <div class="collapse navbar-collapse" id="basicExampleNav">
            <!-- Links -->
            <ul class="navbar-nav mr-auto">
                <RouterLink tag="li" to="/ghi-nhan-yeu-cau" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize ">
              <i class="fa fa-paper-plane-o" /> ghi nhận yêu cầu
            </a>
                </RouterLink>
                <RouterLink tag="li" to="/xac-nhan-vi-tri" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize">
              <i class="fa fa-map-marker" /> Xác nhận vị trí
            </a>
                </RouterLink>
                <RouterLink tag="li" to="/quan-ly-yeu-cau" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize">
              <i class="fa fa-th" /> quản lý yêu cầu
            </a>
                </RouterLink>
                <RouterLink tag="li" to="/tai-xe" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize">
              <i class="fa fa-motorcycle" /> tài xế
            </a>
                </RouterLink>
            </ul>
            <ul class="navbar-nav">
                <!-- <li class="nav-item ml-auto">
                    <a class="nav-link text-uppercase"  v-bind:class="{'hidden':!isLogin}" @click="logOut">
              <i class="fa fa-sign-out" /> Đăng Xuất
            </a>
                </li> -->
                <li class="nav-item dropdown ml-md-auto font-weight-bold" v-bind:class="{'hidden':!isLogin}">
                    <a class="nav-link dropdown-toggle waves-effect waves-light" id="navbarDropdownMenuLink-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <i class="fa fa-user-o "></i> {{user.user_name}} </a>
                    <div class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                        <!-- <a class="dropdown-item waves-effect waves-light" href="#">My account</a> -->
                        <a class="dropdown-item waves-effect waves-light" href="javascript:;" @click="logOut"><i class="fa fa-sign-out" /> Đăng Xuất</a>
                    </div>
                </li>
            </ul>
        </div>
        <!-- Collapsible content -->
    </nav>
    <!--/.Navbar-->
    <RouterView />
</div>
</template>

<script>
import Config from './config';
import axios from 'axios';
import EventBus from '@/eventBus';
export default {
    name: "App",
    data() {
        return {
            isLogin: this.$store.getters.getStatusLogin,
            user:this.$store.getters.getUser
        }
    },
    created() {
        // console.log('b',this.isLogin);
        var self = this;
        EventBus.$on('logged', () => {
            // console.log(data);
            self.isLogin = true;
            self.$store.dispatch("updateStatusLogin", true);
            self.user=self.$store.getters.getUser
        });
        // var user = localStorage.getItem('user');
        // var jwt = localStorage.getItem('jwt');
        var jwt = self.$store.getters.getToken;
        // console.log(user);
        // console.log(jwt);
        axios.get(`${Config.hostAPI}/driver/valid-token`, {
                headers: {
                    'x-access-token': jwt
                }
            }).then((res) => {
                // console.log(res);
                if (res.data.status == 1) { //logined
                    self.isLogin = true;
                    self.$store.dispatch("updateStatusLogin", true);
                } else {
                    self.$store.dispatch("updateStatusLogin", false);
                    self.isLogin = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        // if (user != null && jwt != null) {
        //     this.isLogin = true;
        // } else {
        //     this.isLogin = false;
        // }
        // console.log('a',this.isLogin);
    },
    methods: {
        logOut() {
            var self = this;
            self.isLogin = false;
            localStorage.removeItem('user');
            localStorage.removeItem('jwt');
            self.$store.dispatch("logout");
            self.$router.push({
                name: "Login"
            });
        },

    }
};
</script>

<style>
.my-bg-nav {
    background-image: linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cacd1 65%, #35eb93 100%);
}

.hidden {
    display: none;
}
.dropdown-item:focus, .dropdown-item:hover{
  background-color: #3d3393;
  color: #fff!important;
  box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
}
</style>
