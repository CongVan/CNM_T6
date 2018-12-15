<template>
    <div>
        <div class="container-fluid">
            <div class="row mt-2">

                <div class="col-md-4 col-sm-12">
                    <h2 class="mb-1 text-primary">Danh sách yêu cầu <span class="badge  badge-danger badge-pill ">{{lstRequest.length}}</span></h2>
                    <div class="row px-md-3 list-req ">
                        <div class="scrollbar scrollbar-lady-lips">
                            <div class="force-overflow"></div>
                        </div>
                        <div v-for=" req in lstRequest" :key="req.id" :id="'item'+req.id" class="col-md-12  hoverable rounded pt-2 card mb-2">
                            <p class="dark-grey-text mb-0 ">
                                <strong><i class="fa fa-clock-o"></i> {{req.create_date}}</strong>
                                <strong class="ml-2 float-right text-primary"><i class="fa fa-phone"></i> {{req.customer_phone}}</strong>
                            </p>
                            <a>
                                <span><i class="fa fa-user-circle-o text-info mr-1"></i>{{req.customer_name}}</span><br>
                                <span><i class="fa fa-address-book-o text-info mr-1"></i>{{req.customer_address}}</span>
                            </a>
                            <div class="d-flex justify-content-between">
                                <!-- <span><i class="fa fa-sticky-note-o text-info mr-1"></i> <span>{{req.note}}</span></span> -->

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 col-sm-12">

                    <div class="d-flex justify-content-between">
                        <span>
                            <h3 class="text-primary"><i class="fa fa-map-marker mr-2"></i>227 NVC Q5</h3>
                            <span><i class="fa fa-sticky-note-o text-info mr-2"></i><span>ở nhà</span></span>
                        </span>

                        <button type="button" class="btn btn-indigo btn-md"><i class="fa fa-check"></i> Xác nhận</button>
                    </div>
                    <div id="myMap"></div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GoogleMapsLoader from "google-maps";
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
    mounted() {
        GoogleMapsLoader.KEY = "AIzaSyBVXo0bnqRZwCW0kups3AFnu9LIuSWLwnA";
        GoogleMapsLoader.VERSION = "3.33";
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
        
        this.getLocation();
    },
        methods: {
        getLocation: function () {
            var self = this;
            this.axios
                .get(`http://localhost:3000/request-receiver/get-requests`)
                .then(response => {
                    self.lstRequest = response.data;
                    //console.log(self.lstRequest[0]);
                })
                .catch(function () {});
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
