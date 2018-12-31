<template>
<div>
    <div class="container">
        <h2 class="mb-1 text-primary">Danh sách yêu cầu <span class="badge  badge-danger ">{{lstRequest.length}}</span></h2>
        <div class="row px-3">
            <div v-for="req in lstRequest" :key="req.id" :id="'item'+req.id" class="col-md-3 col-sm-12 px-1 mb-2">
                <div class="card hoverable rounded ">
                    <div class="card-body py-1 px-2">
                        <p class="dark-grey-text mb-0 ">
                            <!-- <i class="fa fa-circle " v-bind:class="statusRequest(req.confirm_status)"></i> -->
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
                        <button class="btn btn-indigo btn-sm waves-effect waves-light" v-if="req.confirm_status==2" @click="findDriver(req)">Tìm tài xế</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MENU CHI TIET -->
    <div class="modal fade top" id="modalDetailRequest" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
        <!--Header -->
        <div class="modal-dialog  modal-lg  modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header pt-2 pb-1  indigo white-text text-uppercase w-100">
                    <h4 class="modal-title w-100" id="myModalLabel">Chi tiết chuyến xe</h4>
                    <button type="button" class="close white-text" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body " style="over-flow:auto">
                    <div class="card-deck ">
                        <div class="card px-1 pt-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin khách hàng</h6>
                                <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-phone-square text-info mr-1 "></i>Điện thoại: {{selectedRequest.customer_phone}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-user-circle-o text-info mr-1"></i>Họ tên: {{selectedRequest.customer_name}}</span>
                                <span class="mb-1 d-block"><i class="fa fa-address-book-o text-info mr-1"></i>Địa chỉ: {{selectedRequest.customer_address}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-sticky-note text-info mr-1"></i>Ghi chú: {{selectedRequest.note}} </span>
                            </div>
                        </div>
                        <div class=" card px-1 pt-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin tài xế</h6>
                                <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-user-circle-o text-info mr-1"></i>Tài khoản: {{selectedRequest.user_name}}</span>
                            </div>
                        </div>
                        <div class="card px-1 pt-2">
                            <div v-if="selectedRequest!=null">
                                <h6 class="mb-0 indigo-text font-weight-bold">Thông tin chuyến xe</h6>
                                <hr class="my-1 indigo text-right" style="width:50%;" align=left />
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1 "></i>Tiếp nhận: {{selectedRequest.create_date}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1 "></i>Tài xế nhận: {{selectedRequest.driving_date}} </span>
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1"></i>Bắt đầu: {{selectedRequest.start_time}}</span>
                                <span class="mb-1 d-block"><i class="fa fa-clock-o text-info mr-1"></i>Kết thúc: {{selectedRequest.end_time}} </span>
                            </div>
                        </div>
                        <div class="col-12 mt-2" v-show="selectedRequest!=null && selectedRequest.user_name!=null">
                            <div id="myMap" class="rounded">
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
import GoogleMapsLoader from 'google-maps';
export default {
    name: "RequestManagement",
    data() {
        return {
            lstRequest: [],
            selectedRequest: null,
            maxheight: 500,
            google: null,
            map: null,
            marker: null,
            infoWindow: null,
            directionsService: null,
            directionsDisplay: null,
        }
    },

    //tao socket xu ly chat
    sockets: {
        connect() {
            var data = {
                room: Config.roomAdmin,
                user:this.$store.getters.getUser.id
            }
            this.$socket.emit("JoinRoom", data);
        },
        disconnected() {
            console.log('disconected');
        },
        joinRoom(data) {
            console.log(data);
        },
        refreshAllData(data) {
            this.lstRequest = data;
        }
    },

    created() {
        this.getLocation();
        this.$socket.close();
        this.$socket.connect();
    },
    mounted() {
        // this.$socket.emit('message', 'App 3') ;
        var self = this;
        self.initMap();
    },
    methods: {
        //Tao map
        initMap() {
            var self = this;
            GoogleMapsLoader.KEY = Config.keyMap;
            GoogleMapsLoader.VERSION = Config.versionMap;
            GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
            GoogleMapsLoader.LANGUAGE = 'vi';
            // console.log("map: ", google.maps);

            GoogleMapsLoader.load(function (google) {
                var map = new google.maps.Map(document.getElementById('myMap'), {
                    zoom: 18,
                    center: {
                        lat: 10.7637665802915,
                        lng: 106.6825457802915
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                self.google = google;
                self.map = map;
                // console.log('map',map);

                // self.marker = new google.maps.Marker({
                //     map: map,
                //     position: self.currLocation, //new google.maps.LatLng(self.currLocation.lat, self.currLocation.lng),
                //     draggable: true,
                //     // animation:google.maps.Animation.DROP
                // });
                self.infoWindow = new google.maps.InfoWindow();
                self.directionsService = new google.maps.DirectionsService;
                self.directionsDisplay = new google.maps.DirectionsRenderer;
                self.directionsDisplay.setMap(self.map);
                // self.currLocation=google.loader.ClientLocation;
                // console.log(google.loader.ClientLocation);
                // console.log(self.google);
                // console.log(self.map);
                // console.log(self.geocoder);
                // self.oldLocationMarker=new google.maps.LatLng();

                // self.zoneCircle = new google.maps.Circle({
                //     strokeColor: '#00C851',
                //     strokeOpacity: 1,
                //     strokeWeight: 1,
                //     fillColor: '#007E33',
                //     fillOpacity: 0.05,
                //     map: self.map,
                //     center: self.currLocation,
                //     radius: self.zoneValid
                // });
                google.maps.event.addDomListener(window, 'resize', function () {
                    var center = self.map.getCenter();
                    google.maps.event.trigger(self.map, 'resize');
                    self.map.setCenter(center);
                });

                // google.maps.event.addListener(self.marker, 'dragstart', function (event) {
                //     // self.oldLocationMarker=this.getPosition();
                //     self.oldLocationMarker.lat = event.latLng.lat();
                //     self.oldLocationMarker.lng = event.latLng.lng();
                //     // console.log(JSON.stringify(self.oldLocationMarker));
                // });
                // google.maps.event.addListener(self.marker, 'dragend', function (event) {
                //     // self.oldLocationMarker=this.getPosition();
                //     self.newLocationMarker.lat = event.latLng.lat();
                //     self.newLocationMarker.lng = event.latLng.lng();
                //     // console.log(JSON.stringify(self.newLocationMarker));
                //     self.validLocation();

                // });
                var body = document.body,
                    html = document.documentElement;
                var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight);
                document.getElementById('myMap').style.height = `${height-250}px`;
                self.maxheight = height - 100;
            });
        },
        //Ve duong di
        drawDirection() {
            var self = this;
            var direction=JSON.parse(self.selectedRequest.direction);
            self.directionsService.route({
                origin: direction.origin,
                destination: direction.destination,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {

                    console.log(response);
                    self.directionsDisplay.setDirections(response);
                } else {
                    self.$toasted.show("Không tìm thấy đường đi!", {
                        theme: "primary",
                        position: "top-center",
                        duration: Config.notificationTime
                    });
                }
            });
        },
        //lay danh sach
        getLocation() {
            var self = this;
            self.axios.get(`${Config.hostAPI}/request-receiver/get-all-requests`) //axios goi API
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
            if(req.user_name!=null){
                self.drawDirection();
            }
        },

        // cap nhat tinh trang
        statusRequest(status) {
            var html = "";
            switch (status) {
                case 1:
                    html = " text-danger ";
                    break;
                case 2:
                    html = " text-default ";
                    break;
                case 3:
                    html = "text-primary";
                    break;
                case 4:
                    html = "text-secondary";
                    break;
                case 5:
                    html = "text-success";
                    break;
                default:
                    html = "text-default";
                    break;
            }
            return html;
        },
        //Tim tai xe
        findDriver(req) {
            this.$socket.emit('SendingRequest', req);
        },
    }
}
</script>

<style>
.modal-body {
    overflow: auto;
    max-height: 27rem;
}
</style>
