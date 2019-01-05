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
          <div class="card-body">
            <h4 class="text-center text-uppercase mb-4 text-primary">Lịch sử yêu cầu</h4>
            <div class="form-inline md-form form-sm mt-0">
              <i class="fa fa-search" aria-hidden="true"></i>
              <input
                class="form-control form-control-sm ml-3 w-75"
                type="text"
                placeholder="Search"
                aria-label="Search"
              >
            </div>
          </div>
          <div class="col-md-12 rounded p-1 card mb-2">
            <ul class="list-group list-group-flush">
              <li class="list-group-item p-1">
                <div class="md-v-line"></div>
                <i class="fa fa-clock-o mr-3"></i> 123
                <strong class="ml-2 float-right">
                  <i class="fa fa-phone"/> 123
                </strong>
              </li>
              <li class="list-group-item p-1">
                <div class="md-v-line"></div>
                <i class="fa fa-user-circle-o mr-3"></i>123
              </li>
              <li class="list-group-item p-1">
                <div class="md-v-line"></div>
                <i class="fa fa-address-book-o mr-3"></i>123
              </li>
            </ul>
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
        note: ""
      }
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
        self.axios
          .post(`${Config.hostAPI}/request-receiver/add-request`, self.request)
          .then(res => {
            self.$toasted.show(res.data.msg, {
              theme: "bubble",
              position: "top-center",
              duration: Config.notificationTime
            });
            self.prefreshForm();
            // alert(res.data.msg);
            // this.$socket.emit('SendingRequest',self.currRequest);
          })
          .catch(err => {
            console.log(err);
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
    }
  }
};
</script>

<style>
</style>
