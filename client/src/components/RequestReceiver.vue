<template>
    <div id="request-receiver">
	    <div class="container">
	        <div class="row d-flex justify-content-center mt-4">
	            <div class="col-md-6 col-sm-12 card">
	                <div class="card-body">
	                    <h4 class="text-center text-uppercase mb-4 text-primary">Ghi nhận yêu cầu</h4>

	                    <div class="md-form form-sm">
	                        <i class="fa fa-user-circle-o prefix "></i>
	                        <input type="text" @keyup.enter="submitRequest()" v-model="request.customer_name" class="form-control form-control-sm" placeholder="Khách hàng">
	                        <!-- <label for="materialFormNameModalEx1">Khách hàng</label> -->
	                    </div>

	                    <div class="md-form form-sm">
	                        <i class="fa fa-phone-square prefix"></i>
	                        <input type="number" @keyup.enter="submitRequest()" v-model="request.customer_phone" class="form-control form-control-sm" placeholder="Số điện thoại">
	                        <!-- <label for="materialFormEmailModalEx1">Số điện thoại</label> -->
	                    </div>

	                    <div class="md-form form-sm">
	                        <i class="fa fa-map-marker prefix"></i>
	                        <input type="text" @keyup.enter="submitRequest()" v-model="request.customer_address" class="form-control form-control-sm" placeholder="Địa chỉ">
	                        <!-- <label for="materialFormSubjectModalEx1">Subject</label> -->
	                    </div>

	                    <div class="md-form form-sm">
	                        <i class="fa fa-sticky-note-o prefix"></i>
	                        <textarea type="text" @keyup.enter="submitRequest()" v-model="request.note" class="md-textarea form-control" placeholder="Ghi chú"></textarea>
	                        <!-- <label for="materialFormMessageModalEx1">Your message</label> -->
	                    </div>

	                    <div class="text-center mt-4 mb-2" @click="submitRequest()">
	                        <button class="btn btn-primary">Gửi yêu cầu
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
    name:"RequestReceiver",
    data() {
        return {
            request: {
                customer_name: '',
                customer_phone: '',
                customer_address: '',
                note: ''
            }
        }
    },

    methods: {
        submitRequest() {
            
        },
        checkRequest() {
            return !(this.request.customer_name == '' ||
                this.request.customer_phone == '' ||
                this.request.customer_address == '');
        },
        prefreshForm() {
            this.request.customer_name = '';
            this.request.customer_phone = '';
            this.request.customer_address = '';
        }
    }
}
</script>

<style>

</style>