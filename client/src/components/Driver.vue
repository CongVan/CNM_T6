<template>
<div class="driver">
    <div class="container">
        <div class="row mb-2 mt-2 d-flex justify-content-center">
            <!-- <div class="col-md-3 col-sm-12  d-flex justify-content-center mb-1">
                <button class="btn btn-block" >Bắt đầu</button>
            </div> -->
            <div class="col-md-3 col-sm-12  d-flex justify-content-center mb-1" v-if="isBusy!=null">
                <button class="btn btn-block" v-bind:class="{'btn-success':isBusy==1,'btn-danger':isBusy==2}"  @click="startDriving" >{{statusButtonStart()}}</button>
            </div>
            <div class="col-md-3 col-sm-12  d-flex justify-content-center mb-1" v-if="isBusy==null">
                <button class="btn btn-primary btn-block" @click="startWaitting" :disabled="isWaitting" v-if="isBusy==null">{{isWaitting?"Đang online....":"Nhận khách"}}</button>
            </div>
            <div class="col-md-3 col-sm-12  d-flex justify-content-center  mb-1" v-if="isBusy==null">
                <button class="btn btn-danger btn-block" @click="stopWaitting" v-if="isWaitting==true && isBusy==null" >Hủy</button>
                <button class="btn btn-danger btn-block" @click="showMap=!showMap" v-if="isWaitting==false && isBusy==null ">{{showMap?'Ẩn bản đồ':'Hiện bản đồ'}}</button>
            </div>
        </div>
        <div class="row mb-2 d-flex justify-content-center">
            <!-- v-bind:class="{'hiddenMap':showMap}" -->
            <div class="col-md-12" v-show="showMap">
                <div id="myMap">
                </div>
            </div>
            <div class="col-md-3 col-sm-12   mt-1 mb-4">
                <button class="btn btn-info btn-block" @click="resetLocation" v-show="showMap==true && isWaitting==false && isBusy==null">Vị trí mặc định</button>
            </div>
        </div>
    </div>
    <button id="btnConfirm" class="btn btn-primary btn-sm float-right mx-0 waves-effect waves-light " hidden data-toggle="modal" data-target="#modalDetailRequest">Xác nhận</button>
    <div class="modal fade right" id="modalDetailRequest" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <!-- Add class .modal-full-height and then add class .modal-right (or other classes from list above) to set a position to the modal -->
        <div class="modal-dialog " role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title w-100" id="myModalLabel">{{confirm.title}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
                </div>
                <div class="modal-body">
                    {{confirm.content}}
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Không nhận</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click="ConfirmRequest">Nhận khách</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Config from '@/config'
import GoogleMapsLoader from 'google-maps'
import {
    setTimeout,
    clearTimeout
} from 'timers'
export default {
    name: "Driver",
    data() {
        return {
            google: null,
            map: null,
            marker: null,
            infoWindow: null,
            directionsService: null,
            directionsDisplay: null,
            currLocation: {
                lat: null,
                lng: null,
            },
            oldLocationMarker: {
                lat: null,
                lng: null,
            },
            newLocationMarker: {
                lat: null,
                lng: null,
            },
            showMap: true,
            zoneCircle: null,
            zoneValid: 100, //100m
            user: this.$store.getters.getUser,
            isWaitting: false,
            isBusy: null,
            confirm: {
                active: false,
                content: 'Có khách bạn có muốn nhận không?',
                title: 'Thông báo',
                ok: 'Nhận khách',
                cancel: 'Không'
            },
            currentRequest: null,

        };
    },
    sockets: {
        connect() {
            // console.log('connected to chat server');
            var self = this;
            var data = {
                room: Config.roomDriver,
                user: self.user.id
            }
            self.$socket.emit("JoinRoom", data);
            self.$socket.emit("testcall", data, function (fn) {
                console.log(fn);
            });
            // self.$socket.on('news',(data,fn)=>{
            //     console.log(data,fn);
            // })
        },
        disconnected() {
            console.log('disconected');
        },
        joinRoom(data) {
            console.log(data);
        },
        ReceiverRequest(result) {
            var self = this;
            if (self.confirm.active == false && self.user.status == 1) {
                self.currentRequest = result.data.request;
                self.confirm.content = `Có khách hàng tại vị trí ${self.currentRequest.customer_address} bạn có muốn nhận?`;

                self.confirm.active = true;
                document.getElementById('btnConfirm').click();
                var count = 10;
                self.countDown = setTimeout(() => {
                    count--;
                    if (count == 0) {
                        clearTimeout(self.countDown);
                        self.NotConfirmRequest();
                    }
                }, 1000)
            }

        },

        testrecei(data, fn, c) {
            console.log('testrecei');
            console.log(data);
            console.log(fn);
            console.log(c);

        }
        // news(data) {
        //     data(1);
        //     console.log('news', data);
        // }
    },
    mounted() {
        // console.clear();
        var self = this;
        self.getCurrentPosition()
            .then(pos => {
                if (pos.coords) {
                    var randomX = 0; //(Math.random() * 0.00001 + 0.001); //1 - 10000
                    self.currLocation.lat = parseFloat(pos.coords.latitude + randomX);
                    self.currLocation.lng = parseFloat(pos.coords.longitude + randomX);
                    self.oldLocationMarker = self.currLocation;
                    self.initMap();
                } else {
                    self.$toasted.show("Ứng dụng không hỗ trợ vị trí", {
                        theme: "bubble",
                        position: "top-left",
                        duration: Config.notificationTime
                    });
                }
                // console.log(pos.coords);
            }).catch(error => {
                var msg = null;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "Vui lòng cấp quyền truy cập vị trí cho ứng dụng";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Vị trí hiện tại không hỗ trợ";
                        break;
                    case error.TIMEOUT:
                        msg = "Không xác định được vị trí";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "Lỗi không xác định";
                        break;
                }
                self.$toasted.show(msg, {
                    theme: "bubble",
                    position: "top-left",
                    duration: Config.notificationTime
                });
            });
        // self.socket.on('news', (data) => {
        //     console.log('news', data);

        //     //  cb(1);   
        //     // you can also do this.messages.push(data)
        // });
    },
    created() {
        this.$socket.close();
        this.$socket.connect();

    },
    methods: {
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
                    center: self.currLocation,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                self.google = google;
                self.map = map;
                // console.log('map',map);
                // var geocoder = new google.maps.Geocoder();
                // if (self.currLocation.lat == null) {
                //     geocoder.geocode({
                //             address: "Quan+1+,+Ho+Chi+Minh"
                //         },
                //         function (results, status) {
                //             if (status == "OK") {
                //                 if (results[0]) {
                //                     self.currLocation.lat = results[0].geometry.location.lat;
                //                     self.currLocation.lng = results[0].geometry.location.lng;
                //                     self.oldLocationMarker = self.currLocation;
                //                     // self.map.setZoom(14);
                //                     // self.marker.setPosition(results[0].geometry.location);
                //                     // self.infoWindow.setContent(`<span>${results[0].formatted_address}</span>`);
                //                     // self.infoWindow.open(self.map,self.marker);
                //                     // self.center(self.marker.getPosition());
                //                     // self.map.setZoom(18);
                //                     self.map.setCenter(results[0].geometry.location);
                //                     // self.currRequest.location_1 = JSON.stringify(
                //                     //     results[0].geometry.location
                //                     // );
                //                 }
                //             }
                //         }
                //     );
                // }
                self.marker = new google.maps.Marker({
                    map: map,
                    position: self.currLocation, //new google.maps.LatLng(self.currLocation.lat, self.currLocation.lng),
                    draggable: true,
                    // icon: iconMarker
                    // animation:google.maps.Animation.DROP
                });
                self.infoWindow = new google.maps.InfoWindow({
                    content: "<b>Bạn đang ở đây</b>"
                });
                self.infoWindow.open(self.map, self.marker);
                self.directionsService = new google.maps.DirectionsService;
                self.directionsDisplay = new google.maps.DirectionsRenderer;
                self.directionsDisplay.setMap(self.map);

                // self.currLocation=google.loader.ClientLocation;
                // console.log(google.loader.ClientLocation);
                // console.log(self.google);
                // console.log(self.map);
                // console.log(self.geocoder);
                // self.oldLocationMarker=new google.maps.LatLng();

                self.zoneCircle = new google.maps.Circle({
                    strokeColor: '#00C851',
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: '#007E33',
                    fillOpacity: 0.05,
                    map: self.map,
                    center: self.currLocation,
                    radius: self.zoneValid
                });
                google.maps.event.addDomListener(window, 'resize', function () {
                    var center = self.map.getCenter();
                    google.maps.event.trigger(self.map, 'resize');
                    self.map.setCenter(center);
                });

                google.maps.event.addListener(self.marker, 'dragstart', function (event) {
                    // self.oldLocationMarker=this.getP osition();
                    self.oldLocationMarker.lat = event.latLng.lat();
                    self.oldLocationMarker.lng = event.latLng.lng();
                    // console.log(JSON.stringify(self.oldLocationMarker));
                });

                google.maps.event.addListener(self.marker, 'dragend', function (event) {
                    // self.oldLocationMarker=this.getPosition();
                    self.newLocationMarker.lat = event.latLng.lat();
                    self.newLocationMarker.lng = event.latLng.lng();
                    // console.log(JSON.stringify(self.newLocationMarker));
                    self.getCurrentPosition().then(pos => {
                        self.currLocation.lat = parseFloat(pos.coords.latitude);
                        self.currLocation.lng = parseFloat(pos.coords.longitude);
                        // self.currLocation=pos;
                        self.validLocation();
                    })

                });
                google.maps.event.addListener(self.marker, 'click', function () {
                    self.infoWindow.open(self.map, self.marker);
                });
                var body = document.body,
                    html = document.documentElement;
                var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight);
                document.getElementById('myMap').style.height = `${height-50}px`;
            });
        },
        statusButtonStart() {
            if (this.isBusy == 1) {
                return 'Bắt đầu';
            } else if (this.isBusy == 2) {
                return 'Kết thúc';
            }
        },
        getCurrentPosition() {
            if (navigator.geolocation) {
                return new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));

            } else {
                // return new Promise(res => resolve());
            }
        },
        resetLocation() {
            var self = this;
            self.setLocationMarker(self.currLocation);
        },
        validLocation() {
            var self = this;
            var distance = self.google.maps.geometry.spherical.computeDistanceBetween(
                new self.google.maps.LatLng(self.currLocation.lat, self.currLocation.lng),
                new self.google.maps.LatLng(self.newLocationMarker.lat, self.newLocationMarker.lng)
            );
            console.log(self.currLocation.lat, self.currLocation.lng);
            console.log(self.newLocationMarker.lat, self.newLocationMarker.lng);
            console.log(distance);
            if (distance > self.zoneValid) {
                self.setLocationMarker(self.oldLocationMarker);
                self.$toasted.show(`Vị trí cập nhật không quá ${self.zoneValid}m so với mặc định`, {
                    theme: "bubble",
                    position: "top-left",
                    duration: Config.notificationTime
                });
            } else {
                self.updateLocationDriver();
            }
            // console.log(distance);
            // console.log(dtest);
        },
        startWaitting() {
            var self = this;

            // console.log(self.user);
            // return;
            self.axios.post(`${Config.hostAPI}/driver/online`, self.user)
                .then(res => {
                    if (res.data.result == 1) {
                        self.isWaitting = true;
                        self.user.status = 1;
                        self.user.location = JSON.stringify(self.oldLocationMarker);
                        self.marker.setDraggable(false);

                    }
                    self.$toasted.show(res.data.msg, {
                        theme: "bubble",
                        position: "top-right",
                        duration: Config.notificationTime
                    });
                })
                .catch(err => {
                    console.log(err);
                    self.$toasted.show(err, {
                        theme: "bubble",
                        position: "top-right",
                        duration: Config.notificationTime
                    });
                });
        },
        stopWaitting() {
            var self = this;
            self.isWaitting = !self.isWaitting;
            self.marker.setDraggable(true);
            self.user.status = 2;
            self.axios.post(`${Config.hostAPI}/driver/offline`, self.user)
                .then(res => {
                    self.$toasted.show(res.data.msg, {
                        theme: "bubble",
                        position: "top-right",
                        duration: Config.notificationTime
                    });
                    // alert(res.data.msg);
                })
                .catch(err => {
                    console.log(err);
                    self.$toasted.show(err, {
                        theme: "bubble",
                        position: "top-right",
                        duration: Config.notificationTime
                    });
                });
        },
        setLocationMarker(pos) {
            var self = this;
            self.marker.setPosition(pos);
            self.map.setCenter(self.marker.getPosition());
            self.map.setZoom(20);
            self.map.setZoom(18);
        },
        updateLocationDriver() {
            var self = this;
            // self.oldLocationMarker = JSON.stringify(self.marker.getPosition());
            self.user.location = JSON.stringify(self.oldLocationMarker)

            // console.log(self.user);
            self.axios.post(`${Config.hostAPI}/driver/update-location`, self.user)
                .then(res => {
                    self.$toasted.show(res.data.msg, {
                        theme: "bubble",
                        position: "top-right",
                        duration: 1000
                    });
                    // alert(res.data.msg);
                })
                .catch(err => {
                    console.log(err);
                    self.$toasted.show(err, {
                        theme: "bubble",
                        position: "top-right",
                        duration: 1000
                    });
                });
        },
        startDriving() {
            var self = this;
            if (self.isBusy == 1) {
                self.marker.setDraggable(false);
                self.isBusy = 2;
                self.axios.post(`${Config.hostAPI}/request-receiver/update-status-request`, {
                        requestId: self.currentRequest.id,
                        userId: self.user.id,
                        status: 4,
                        statusDriving: 2
                    })
                    .then(results => {
                        console.log('update status', results);
                        if (results.data.result == 1) {
                            self.$toasted.show("Bắt đầu chuyến đi nào!", {
                                theme: "bubble",
                                position: "top-right",
                                duration: Config.notificationTime
                            });
                        } else {
                            self.$toasted.show("Cập nhật trạng thái thất bại!", {
                                theme: "bubble",
                                position: "top-right",
                                duration: Config.notificationTime
                            });
                        }

                    }).catch(err => {
                        console.log(err);
                    });
            } else if (self.isBusy == 2) {
                self.directionsDisplay.setDirections({
                    routes: []
                });
                self.axios.post(`${Config.hostAPI}/request-receiver/update-status-request`, {
                        requestId: self.currentRequest.id,
                        userId: self.user.id,
                        status: 5,
                        statusDriving: 3
                    })
                    .then(results => {
                        console.log('update status', results);
                        if (results.data.result == 1) {
                            self.$toasted.show("Hoàn thành chuyến đi!", {
                                theme: "bubble",
                                position: "top-right",
                                duration: Config.notificationTime
                            });
                        } else {
                            self.$toasted.show("Cập nhật trạng thái thất bại!", {
                                theme: "bubble",
                                position: "top-right",
                                duration: Config.notificationTime
                            });
                        }
                        self.isBusy = null;
                        self.isWaitting = true;
                        self.currentRequest = null;
                        self.startWaitting();
                    }).catch(err => {
                        console.log(err);
                    })

            }
        },
        drawDirection() {
            var self = this;
            self.directionsService.route({
                origin: JSON.parse(self.user.location),
                destination: JSON.parse(self.currentRequest.location_1),
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {

                    console.log(response);
                    self.directionsDisplay.setDirections(response);
                } else {
                    self.$toasted.show("Không tìm thấy đường đi!", {
                        theme: "bubble",
                        position: "top-right",
                        duration: Config.notificationTime
                    });
                }
            });
        },
        ConfirmRequest() {
            var self = this;
            clearTimeout(self.countDown);
            self.confirm.active = false;
            self.user.status = 2; //busy
            document.getElementById('btnConfirm').click();
            self.axios.post(`${Config.hostAPI}/request-receiver/confirm-driver-request`, {
                    requestId: self.currentRequest.id,
                    driverId: self.user.id,
                    status: true,
                    direction: {
                        origin: JSON.parse(self.user.location),
                        destination: JSON.parse(self.currentRequest.location_1),
                    }
                })
                .then(results => {
                    console.log(results);
                    self.drawDirection();
                    self.isBusy = 1;
                }).catch(err => {
                    console.log(err);
                })
        },
    }
};
</script>

<style>
.hiddenMap {
    display: none;
}

/* .list-req {
    max-height: 80vh;
    overflow: auto;
} */
.active-modal {
    padding-right: 15px;
    display: block;
}

#myMap {
    /* position: relative; */
    /* height: 100% ; */
    width: 100%;
    /* max-height: 70%; */
    /* height: 0;
    overflow: hidden;
    padding-bottom: 99%;
    padding-top: 30px; */
    /* width: 100%;
     */
    /* position: relative; */
}
</style>
