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
                        <button class="btn btn-link btn-sm shadow" @click="loadDetailRequest(req)" data-toggle="modal" data-target="#modalDetailRequest">Chi tiết</button>
                        <button class="btn btn-indigo btn-sm waves-effect waves-light">Tìm tài xế</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MENU CHI TIET -->
    <div class="modal fade top" id="modalDetailRequest" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" 
    aria-hidden="true" data-backdrop="false">
        <!--Header -->
        <div class="modal-dialog  modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header pt-2 pb-1  indigo white-text text-uppercase w-100">
                    <h4 class="modal-title w-100" id="myModalLabel">Chi tiết chuyến xe</h4>
                    <button type="button" class="close white-text" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body " style="over-flow:auto">
                    <div class="row ">
                        <div class="col-md-4 col-sm-12 card pt-2 mr-1 mb-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin khách hàng</h6>
                                <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-phone-square text-info mr-1 "></i>Điện thoại: {{selectedRequest.customer_phone}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-user-circle-o text-info mr-1"></i>Họ tên: {{selectedRequest.customer_name}}</span>
                                <span class="mb-1 d-block"><i class="fa fa-address-book-o text-info mr-1"></i>Địa chỉ: {{selectedRequest.customer_address}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-sticky-note text-info mr-1"></i>Ghi chú: {{selectedRequest.note}} </span>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-12 card pt-2 mr-1 mb-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin tài xế</h6>
                                <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-user-circle-o text-info mr-1"></i>Tài khoản: {{selectedRequest.user_name}}</span>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-12 card pt-2 mr-1 mb-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin chuyến xe</h6>
                                 <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1 "></i>Tiếp nhận: {{selectedRequest.create_date}} </span> 
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1 "></i>Tài xế nhận: {{selectedRequest.driving_date}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1"></i>Bắt đầu: {{selectedRequest.start_time}}</span>
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1"></i>Kết thúc: {{selectedRequest.end_time}} </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-outline-primary btn-sm" data-dismiss="modal">Đóng</button>
                </div>
            </div>
        </div>
    </div>
    <!--MENU CHI TIET -->
</div>
</template>

<script>
import Config from '../config';

export default {
    name: "RequestManagement",
    data() {
        return {
            lstRequest: [],
            selectedRequest: null,
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
        },
    }
}
</script>

<style>

</style>
