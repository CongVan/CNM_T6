<template>
    <div id="login" class="">
    <div class="container">
        <div class="row d-flex justify-content-center mt-3">
            <div class="col-md-6 col-sm-12 card">
                <div class="card-body">
                    <h4 class="text-center text-uppercase mb-4 text-primary">Đăng nhập</h4>

                    <div class="md-form form-sm">
                        <i class="fa fa-user-circle-o prefix "></i>
                        <input type="text" @keyup.enter="handleSubmit()" placeholder="Tài khoản" v-model="userName" class="form-control form-control-sm">
                        <!-- <label for="materialFormNameModalEx1">Khách hàng</label> -->
                    </div>

                    <div class="md-form form-sm">
                        <i class="fa fa-lock  prefix"></i>
                        <input type="password" @keyup.enter="handleSubmit()" placeholder="Mật khẩu" v-model="password" class="form-control form-control-sm" >
                        <!-- <label for="materialFormEmailModalEx1">Số điện thoại</label> -->
                    </div>
                    <div class="text-center mt-4 mb-2" @click="handleSubmit()">
                        <button class="btn btn-primary">Đăng nhập
                    <i class="fa fa-send ml-2"></i>
                </button>
                    </div>

                </div>

            </div>

        </div>
    </div>

</div>
</template>

<script>
export default {
    name:"Login",
    data() {
        return {
            userName: "user1",
            password: "user1"
        }
    },
    methods: {
        handleSubmit() {

            var self = this;
            if (self.userName.length > 0 && self.password.length > 0) {
                console.log(self.userName,self.password);

            } else {
                self.password = "";
                self.$toasted.show("Tên đăng nhập/ mật khẩu không đúng", {
                        theme: "bubble",
                        position: "top-center",
                        duration: 5000
                    });
                
            }
        }
    }
}
</script>

<style>

</style>
