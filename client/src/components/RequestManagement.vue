<template>
<div>
    <div class="container">
        <h2 class="mb-1 text-primary">Danh sách yêu cầu <span class="badge  badge-danger ">{{lstRequest.length}}</span></h2>
        <div class="row px-3">
            <div v-for="req in lstRequest" :key="req.id" :id="'item'+req.id" class="col-md-3 col-sm-12 px-1 mb-2">
                <div class="card hoverable rounded ">
                    <div class="card-body py-1 px-2">
                        <p class="dark-grey-text mb-0 ">
                            <strong><i class="fa fa-clock-o"></i> {{req.create_date}} </strong>
                            <span class="badge  badge-danger  pull-right py-1" v-if="req.confirm_status==1">Chưa định vị</span>
                            <span class="badge  badge-default  pull-right py-1" v-if="req.confirm_status==2">Đã định vị</span>
                            <span class="badge  badge-primary  pull-right py-1" v-if="req.confirm_status==3">Đã có tài xế nhận</span>
                            <span class="badge  badge-secondary  pull-right py-1" v-if="req.confirm_status==4">Đang di chuyển</span>
                            <span class="badge  badge-success  pull-right py-1" v-if="req.confirm_status==5">Hoàn tất</span>
                        </p>
                        <a class="pull-left">
                            <span><i class="fa fa-phone-square text-info mr-1"></i>{{req.customer_phone}} </span><br>
                            <span><i class="fa fa-user-circle-o text-info mr-1"></i>{{req.customer_name}}</span><br>
                            <span><i class="fa fa-address-book-o text-info mr-1"></i>{{req.customer_address}} </span>
                        </a>
                    </div>
                    <div class="d-flex justify-content-end ">
                        <button class="btn btn-link btn-sm shadow">Chi tiết</button>
                        <button class="btn btn-indigo btn-sm waves-effect waves-light" v-if="req.confirm_status<=2" @click="findDriver(req)">Tìm tài xế</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Config from '../config';

export default {
    name: "RequestManagement",
    data() {
        return {
            lstRequest: [],
            maxheight: 500
        }
    },

 
    created() {
        this.getLocation(); 
    },

    methods: {
        //lay danh sach
        getLocation() {
            var self = this;
            this.axios.get(`${Config.hostAPI}/request-receiver/get-all-requests`) //axios goi API
                //goi tu config.js
                .then(response => {
                    self.lstRequest = response.data;
                    console.log(self.lstRequest);
                })
                .catch(function () {});
        },

        //load chi tiet
        loadDetailRequest(req) {
            var self = this;
            self.selectedRequest = req;
            if (req.user_name != null) {
                self.drawDirection();
            }

        },
    }
}
</script>

<style>

</style>
