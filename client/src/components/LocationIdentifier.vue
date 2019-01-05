<template>
<div>
    <div class="container-fluid">
        <div class="row mt-2">
            <div class="col-md-4 col-sm-12 ">
                <h2 class="mb-2 text-primary shadow p-2 mr-3 rounded z-depth-1 text-center">
                    Danh sách yêu cầu <span class="badge  badge-danger rounded pl-1 ">
              {{ lstRequest.length }}
            </span>
                </h2>
                <div class="row px-md-3 list-req ">
                    <div class="scrollbar scrollbar-lady-lips">
                        <div class="force-overflow" />
                    </div>
                    <div v-for=" req in lstRequest" :key="req.id" :id="'item'+req.id" class="col-md-12  rounded p-1 card mb-2" @click="loadDetailReqest(req)" :class="{'blue accent-3':activeReq(req.id)}">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item p-1 " :class="{'active':activeReq(req.id)}">
                                <div class="md-v-line"></div><i class="fa fa-clock-o mr-3 "></i> {{ req.create_date }}
                                <strong class="ml-2 float-right "><i class="fa fa-phone" /> {{ req.customer_phone }}</strong>
                            </li>
                            <li class="list-group-item p-1">
                                <div class="md-v-line"></div><i class="fa fa-user-circle-o mr-3"></i>{{ req.customer_name }}
                            </li>
                            <li class="list-group-item p-1">
                                <div class="md-v-line"></div><i class="fa fa-address-book-o  mr-3"></i>{{ req.customer_address }}
                            </li>

                        </ul>
                        
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8 col-sm-12  px-2">

                <div class="card" v-if="currRequest">
                    <ul class="list-group list-group-flush ">
                        <li class="list-group-item p-1 ">
                            <div class="md-v-line"></div><i class="fa fa-clock-o mr-1"></i>Thời gian: {{ currRequest.create_date }}
                            <button type="button" class="btn btn-success font-weight-bold btn-sm m-0 btn-confirm" @click="submitConfirmLocation"><i class="fa fa-check" /> Xác nhận</button>
                        </li>
                        <li class="list-group-item p-1">
                            <div class="md-v-line"></div><i class="fa fa-user-circle-o mr-1"></i>Khách hàng: {{ currRequest.customer_name }}
                        </li>
                        <li class="list-group-item p-1">
                            <div class="md-v-line"></div><i class="fa fa-phone mr-1"></i>Điện thoại: {{ currRequest.customer_phone }}
                        </li>
                        <li class="list-group-item p-1">
                            <div class="md-v-line"></div><i class="fa fa-address-book-o  mr-1"></i>Địa chỉ: {{ currRequest.customer_address }}
                        </li>

                    </ul>
                    <!-- <span>
              <h3 class="text-primary">
                <i class="fa fa-map-marker mr-2" />{{ currRequest.customer_address }}
              </h3>
              <span><i class="fa fa-sticky-note-o text-info mr-2" /><span>{{ currRequest.note }}</span></span>
                    </span>

                    <button
              type="button"
              class="btn btn-indigo btn-md"
              @click="submitConfirmLocation"
            >
              <i class="fa fa-check" /> Xác nhận
            </button> -->

                </div>
                <div id="myMap" class="card mt-1 rounded" v-show="currAdsress!=null"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import GoogleMapsLoader from "google-maps";
import Config from '../config';
export default {
    name: "LocationIdentifier",
    data() {
        return {
            // default to Montreal to keep it simple
            // change this to whatever makes sense
            center: {
                lat: 45.508,
                lng: -73.587
            },
            google: null,
            map: null,
            geocoder: null,
            marker: null,
            infoWindow: null,
            markers: [],
            places: [],
            lstRequest: [],
            currRequest: null,
            currAdsress: ""
        };
    },

    sockets: {
        connect() {
            // console.log('connected to chat server');
            var data = {
                room: Config.roomAdmin,
                user: this.$store.getters.getUser.id
            }
            this.$socket.emit("JoinRoom", data);
        },
        disconnected() {
            console.log('disconected');
        },
        joinRoom(data) {
            console.log(data);
        },
        refreshData(data) {
            // this function gets triggered once a socket event of `message` is received
            this.lstRequest = data; // append each new message to the textarea and add a line break
            this.currRequest = this.lstRequest.length == 0 ? null : this.lstRequest[0];
        }
    },
    mounted() {
        GoogleMapsLoader.KEY = Config.keyMap;
        GoogleMapsLoader.VERSION = Config.versionMap;
        GoogleMapsLoader.LIBRARIES = ["geometry", "places"];
        GoogleMapsLoader.LANGUAGE = "vi";
        // console.log("map: ", google.maps);
        var self = this;
        GoogleMapsLoader.load(function (google) {
            var map = new google.maps.Map(document.getElementById("myMap"), {
                zoom: 17,
                center: {
                    lat: 10.7637665802915,
                    lng: 106.6825457802915
                }
            });

            self.map = map;
            // console.log('map',map);
            self.geocoder = new google.maps.Geocoder();
            self.marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(10.7637665802915, 106.6825457802915),
                draggable: true
                // animation:google.maps.Animation.DROP
            });
            self.infoWindow = new google.maps.InfoWindow();

            google.maps.event.addListener(self.marker, 'dragstart', function () {
                self.infoWindow.close();
            });

            google.maps.event.addListener(self.marker, 'dragend', function (event) {

                self.reverseGeocode({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                });

            });
            // google.maps.event.addListener(self.marker, 'click', function () {
            //     if (self.infoWindow.opened) {
            //         self.infoWindow.close();
            //     } else {
            //         self.infoWindow.open(self.map, self.marker);
            //     }

            // });
            // console.log(self.google);
            // console.log(self.map);
            // console.log(self.geocoder);
        });
        // self.$socket.emit("message", "App2");
    },
    beforeCreate() {
        document.body.className = ` `;
    },
    created() {
        this.$socket.close();
        this.$socket.connect();
        this.getLocation();
    },
    methods: {
        loadDetailReqest(req) {
            var self = this;
            self.currRequest = req;
            // console.log(self.currRequest);
            self.geocodeAddress(req.customer_address);

        },
        getDriverNearest(locationRequest) {
            var self = this;
            console.log(locationRequest);
            self.axios.get(`${Config.hostAPI}/driver/get-nearest`, {
                    params: {
                        locationRequest:locationRequest
                    }
                })
                .then(results => {
                    console.log(results);
                }).catch(err => {
                    self.$toasted.show(err, {
                        theme: "bubble",
                        position: "top-center",
                        duration: Config.notificationTime
                    });
                })
        },
        activeReq(id) {
            if (this.currRequest) {
                return id == this.currRequest.id;
            }
            return false;
        },
        getLocation: function () {
            var self = this;
            self.axios
                .get(`${Config.hostAPI}/request-receiver/get-requests`)
                .then(response => {
                    self.lstRequest = response.data;
                    //console.log(self.lstRequest[0]);
                })
                .catch(function () {});
        },
        geocodeAddress(addr) {
            var self = this;

            var ad = addr.replace(/ /g, "+");
            // var key = "AIzaSyBVXo0bnqRZwCW0kups3AFnu9LIuSWLwnA";
            // var uri = `https://maps.googleapis.com/maps/api/geocode/json`;
            self.geocoder.geocode({
                    address: ad
                },
                function (results, status) {
                    if (status == "OK") {
                        if (results[0]) {
                            // self.map.setZoom(14);
                            var location = results[0].geometry.location;
                            self.marker.setPosition(location);
                            self.infoWindow.setContent(self.templateInfoWindow(results[0].formatted_address));
                            self.infoWindow.open(self.map, self.marker);
                            // self.center(self.marker.getPosition());
                            self.map.setZoom(18);
                            self.map.setCenter(location);
                            self.currRequest.location_1 = JSON.stringify(
                                location
                            );
                            // console.log(location.lat());
                            self.getDriverNearest({
                                lat: location.lat(),
                                lng: location.lng()
                            });
                        }
                    }
                }
            );
        },
        templateInfoWindow(content) {
            return `
                <div class='text-center font-weight-bold' style='max-with:50px'> ${content}</div>
                `
        },
        reverseGeocode(latlng) {
            var self = this;

            self.geocoder.geocode({
                'location': latlng
            }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        self.infoWindow.setContent(self.templateInfoWindow(results[0].formatted_address));
                        self.infoWindow.open(self.map, self.marker);
                    } else {
                        self.infoWindow.setContent(self.templateInfoWindow('Không tìm thấy địa chỉ'));
                        self.infoWindow.open(self.map, self.marker);
                        //   window.alert('No results found');
                    }
                } else {
                    self.infoWindow.setContent('Lỗi: ' + status);
                    self.infoWindow.open(self.map, self.marker);
                    // window.alert('Geocoder failed due to: ' + status);
                }
            });
        },
        submitConfirmLocation() {
            var self = this;
            self.currRequest.location_2 = JSON.stringify(self.marker.getPosition());
            console.log(self.currRequest);
            self.axios
                .post(
                    `${Config.hostAPI}/request-receiver/confirm-location-request`,
                    self.currRequest
                )
                .then(res => {
                    self.$socket.emit('SendingRequest', self.currRequest);
                    self.$toasted.show(res.data.msg, {
                        theme: "bubble",
                        position: "top-center",
                        duration: Config.notificationTime
                    });
                    // alert(res.data.msg);

                })
                .catch(err => {
                    console.log(err);
                });
        },
    }
}
</script>

<style>
.list-req {
    max-height: 80vh;
    overflow: auto;
}

#myMap {
    height: 65vh;
    max-height: 65vh;
    width: 100%;
}

.btn-confirm {
    position: absolute;
    right: 1px;
    top: 1px;
}
</style>
