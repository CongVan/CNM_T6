<template>
  <div id="request-receiver">
    <div class="container">
      <div class="row d-flex justify-content-center mt-4">
        <div class="col-md-6 col-sm-12 card">
          <div class="card-body">
            <h4 class="text-center text-uppercase mb-4 text-primary">Ghi nhận yêu cầu</h4>
            <div class="md-form form-sm">
              <i class="fa fa-user-circle-o prefix"/>
              <input
                type="text"
                @keyup.enter="submitRequest()"
                v-model="request.customer_name"
                class="form-control form-control-sm"
                placeholder="Khách hàng"
              >
              <!-- <label for="materialFormNameModalEx1">Khách hàng</label> -->
            </div>
            <div class="md-form form-sm">
              <i class="fa fa-phone-square prefix"/>
              <input
                type="number"
                @keyup.enter="submitRequest()"
                v-model="request.customer_phone"
                class="form-control form-control-sm"
                placeholder="Số điện thoại"
              >
              <!-- <label for="materialFormEmailModalEx1">Số điện thoại</label> -->
            </div>
            <div class="md-form form-sm">
              <i class="fa fa-map-marker prefix"/>
              <input
                type="text"
                @keyup.enter="submitRequest()"
                v-model="request.customer_address"
                class="form-control form-control-sm"
                placeholder="Địa chỉ"
              >
              <!-- <label for="materialFormSubjectModalEx1">Subject</label> -->
            </div>
            <div class="md-form form-sm">
              <i class="fa fa-sticky-note-o prefix"/>
              <textarea
                type="text"
                @keyup.enter="submitRequest()"
                v-model="request.note"
                class="md-textarea form-control"
                placeholder="Ghi chú"
              />
              <!-- <label for="materialFormMessageModalEx1">Your message</label> -->
            </div>
            <div class="text-center mt-4 mb-2" @click="submitRequest()">
              <button class="btn btn-primary">
                Gửi yêu cầu
                <i class="fa fa-send ml-2"/>
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-12 card">
          <div class="card-body px-1">
            <h4 class="text-center text-uppercase mb-4 text-primary">Lịch sử yêu cầu</h4>
            <div class="form-inline md-form form-sm mt-0">
              <a @click="searchRequest()">
                <i class="fa fa-search text-primary" aria-hidden="true"></i>
              </a>
              <input
                class="form-control form-control-sm ml-3 w-75"
                type="text"
                placeholder="Tìm kiếm lịch sử yêu cầu "
                aria-label="Nhập số điện thoại yêu cầu"
                v-model="searchQuery"
                @keyup.enter="searchRequest()"
              >
            </div>
            <div class="content-history pr-2">
              <span class="text-muted" v-if="lstRequestHistory.length>0">
                Tìm thấy
                <span class="font-weight-bold">{{lstRequestHistory.length}}</span> yêu cầu
              </span>
              <div
                v-for=" req in lstRequestHistory"
                :key="req.id"
                :id="'item'+req.id"
                class="rounded p-1 card mb-3"
              >
                <ul class="list-group list-group-flush" @mousemove="hoverListRequestHandle(req)">
                  <li class="list-group-item p-1" :class="{'active':activeRequest(req.id)}">
                    <div class="md-v-line"></div>
                    <i class="fa fa-clock-o mr-3"></i>
                    {{ req.create_date }}
                    <strong class="ml-2 float-right">
                      <i class="fa fa-phone"/>
                      {{ req.customer_phone }}
                    </strong>
                  </li>
                  <li class="list-group-item p-1">
                    <div class="md-v-line"></div>
                    <i class="fa fa-user-circle-o mr-3"></i>
                    {{ req.customer_name }}
                  </li>
                  <li class="list-group-item p-1">
                    <div class="md-v-line"></div>
                    <i class="fa fa-address-book-o mr-3"></i>
                    {{ req.customer_address }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from "@/config";
export default {
  name: "RequestReceiver",
  data() {
    return {
      request: {
        customer_name: "",
        customer_phone: "",
        customer_address: "",
        note: "",
        confirm_status: 1,
        location_1: "",
        location_2: ""
      },
      lstRequestHistory: [],
      searchQuery: "",
      selectedRequest: null
    };
  },
  sockets: {
    connect() {
      //  console.log('connected to chat server');

      var data = {
        room: Config.roomAdmin,
        user: this.$store.getters.getUser.id
      };
      this.$socket.emit("JoinRoom", data);
    }
  },
  created() {
    this.$socket.close();
    this.$socket.connect();
  },
  methods: {
    submitRequest() {
      var self = this;
      if (self.checkRequest() == true) {
        self.checkExsitsRequest().then(check => {
          console.log("BEFORE ADD", check);
          if (check == 1) {
            // da ton tai request
            self.request.confirm_status = 2;
          } else {
            // da ton tai request
            self.request.confirm_status = 1;
          }
          console.log("BEFORE ADD", self.request);
          self.axios
            .post(
              `${Config.hostAPI}/request-receiver/add-request`,
              self.request
            )
            .then(res => {
              self.$toasted.show(res.data.msg, {
                theme: "bubble",
                position: "top-center",
                duration: Config.notificationTime
              });

              if (check == 1) {
                self.$socket.emit("SendingRequest", self.request);
                self.$toasted.show(
                  "Địa chỉ đã được định vị, đã gởi yêu cầu đến tài xế!",
                  {
                    theme: "bubble",
                    position: "top-center",
                    duration: Config.notificationTime
                  }
                );
              }
              self.prefreshForm();
              // alert(res.data.msg);
              // this.$socket.emit('SendingRequest',self.currRequest);
            })
            .catch(err => {
              console.log(err);
            });
        });
      } else {
        self.$toasted.show("Vui lòng nhập đủ dữ liệu!", {
          theme: "bubble",
          position: "top-center",
          duration: Config.notificationTime
        });
      }
    },
    checkRequest() {
      return !(
        this.request.customer_name == "" ||
        this.request.customer_phone == "" ||
        this.request.customer_address == ""
      );
    },
    prefreshForm() {
      this.request.customer_name = "";
      this.request.customer_phone = "";
      this.request.customer_address = "";
      this.request.note = "";
    },
    searchRequest() {
      var self = this;
      if (self.searchQuery) {
        self.axios
          .get(`${Config.hostAPI}/request-receiver/search-request`, {
            params: {
              phoneNumber: self.searchQuery
            }
          })
          .then(results => {
            if (results.data.status == 1) {
              self.lstRequestHistory = results.data.requests;
            } else {
              self.$toasted.show("Không tìm thấy yêu cầu! ", {
                theme: "bubble",
                position: "top-center",
                duration: Config.notificationTime
              });
            }
          })
          .catch(err => {
            self.$toasted.show("Lỗi tìm kiếm yêu cầu" + err, {
              theme: "bubble",
              position: "top-center",
              duration: Config.notificationTime
            });
          });
      }
    },
    hoverListRequestHandle(req) {
      var self = this;
      self.selectedRequest = req;
    },
    activeRequest(id) {
      return this.selectedRequest ? id == this.selectedRequest.id : false;
    },
    checkExsitsRequest() {
      var self = this;
      return new Promise((res, rej) => {
        self.axios
          .get(`${Config.hostAPI}/request-receiver/check-exsits-request`, {
            params: {
              addr: self.request.customer_address
            }
          })
          .then(result => {
            console.log("check", result.data);
            if (result.data.status == 1 && result.data.requests.length > 0) {
              self.request.location_1 = result.data.requests[0].location_1;
              self.request.location_2 = result.data.requests[0].location_2;
              res(1);
              //da ton tai
            } else {
              res(0);
              //chua ton tai
            }
            // self.$toasted.show(res.data.msg, {
            //   theme: "bubble",
            //   position: "top-center",
            //   duration: Config.notificationTime
            // });
            // self.prefreshForm();
            // alert(res.data.msg);
            // this.$socket.emit('SendingRequest',self.currRequest);
          })
          .catch(err => {
            res(-1);
            console.log(err);
          });
      });
    }
  }
};
</script>

<style>
.content-history {
  max-height: 60vh;
  overflow: auto;
}
</style>
