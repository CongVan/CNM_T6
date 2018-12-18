<template>
  <div>
    <div class="container-fluid">
      <div class="row mt-2">
        <div class="col-md-4 col-sm-12">
          <h2 class="mb-1 text-primary">
            Danh sách yêu cầu <span class="badge  badge-danger badge-pill ">
              {{ lstRequest.length }}
            </span>
          </h2>
          <div class="row px-md-3 list-req ">
            <div class="scrollbar scrollbar-lady-lips">
              <div class="force-overflow" />
            </div>
            <div
              v-for=" req in lstRequest"
              :key="req.id"
              :id="'item'+req.id"
              class="col-md-12  hoverable rounded pt-2 card mb-2"
              @click="loadDetailReqest(req)"
              :class="{'blue lighten-5':activeReq(req.id)}"
            >
              <p class="dark-grey-text mb-0 ">
                <strong><i class="fa fa-clock-o" /> {{ req.create_date }}</strong>
                <strong class="ml-2 float-right text-primary">
                  <i class="fa fa-phone" /> {{ req.customer_phone }}
                </strong>
              </p>
              <a>
                <span><i class="fa fa-user-circle-o text-info mr-1" />{{ req.customer_name }}</span><br>
                <span><i class="fa fa-address-book-o text-info mr-1" />{{ req.customer_address }}</span>
              </a>
              <div class="d-flex justify-content-between">
                <!-- <span><i class="fa fa-sticky-note-o text-info mr-1"></i> <span>{{req.note}}</span></span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 col-sm-12">
          <div
            class="d-flex justify-content-between"
            v-if="currRequest"
          >
            <span>
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
            </button>
          </div>
          <div id="myMap" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleMapsLoader from "google-maps";
import Config from '../config';
export default {
    name:"LocationIdentifier",
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
            var data={
                room:Config.roomAdmin,
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
            this.currRequest =this.lstRequest.length == 0 ? null : this.lstRequest[0];
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
            // console.log(self.google);
            // console.log(self.map);
            // console.log(self.geocoder);
        });
        // self.$socket.emit("message", "App2");
    },
     beforeCreate(){
        document.body.className = ` `;
    },
    created() {
        this.$socket.close();
        this.$socket.connect();
        this.getLocation();
    },
    methods: {
        loadDetailReqest(req) {
            this.currRequest = req;
            // console.log(this.currRequest);
            this.geocodeAddress(req.customer_address);
        },
        activeReq(id) {
            if (this.currRequest) {
                return id == this.currRequest.id;
            }
            return false;
        },   
        getLocation: function () {
            var self = this;
            this.axios
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
                            self.marker.setPosition(results[0].geometry.location);
                            // self.infoWindow.setContent(`<span>${results[0].formatted_address}</span>`);
                            // self.infoWindow.open(self.map,self.marker);
                            // self.center(self.marker.getPosition());
                            self.map.setZoom(18);
                            self.map.setCenter(results[0].geometry.location);
                            self.currRequest.location_1 = JSON.stringify(
                                results[0].geometry.location
                            );
                        }
                    }
                }
            );
        },
        submitConfirmLocation() {
            var self = this;
            self.currRequest.location_2 = JSON.stringify(self.marker.getPosition());
            self.axios
                .post(
                    `${Config.hostAPI}/request-receiver/confirm-location-request`,
                    self.currRequest
                )
                .then(res => {
                    self.$socket.emit('SendingRequest',self.currRequest);
                    self.$toasted.show(res.data.msg, {
                        theme: "bubble",
                        position: "top-center",
                        duration: 5000
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
        height: 70vh;
        max-height: 70vh;
        width: 100%;
    }
</style>
