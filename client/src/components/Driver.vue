<template>
<div class="driver">
    <div class="container">
        <div class="row mb-2 mt-2 d-flex justify-content-center">
            <!-- <div class="col-md-3 col-sm-12  d-flex justify-content-center mb-1">
                <button class="btn btn-block" >Bắt đầu</button>
            </div> -->
            <div class="col-md-3 col-sm-12  d-flex justify-content-center mb-1">
                <button class="btn btn-primary btn-block" @click="startWaitting" :disabled="isWaitting" v-if="isBusy==null">{{isWaitting?"Đang online....":"Nhận khách"}}</button>
            </div>
            <div class="col-md-3 col-sm-12  d-flex justify-content-center  mb-1">
                <button class="btn btn-danger btn-block" @click="stopWaitting" v-if="isWaitting==true" >Hủy</button>
                <button class="btn btn-danger btn-block" v-if="isWaitting==false">Thay đổi vị trí</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "Driver",
    data() {
        return {
            user: {
                id: 1,
            },
            isWaitting: false,
            isBusy: null,
        };
    },
    methods: {
      startWaitting(){
         var self = this;
         self.isWaitting = true;
      },
      stopWaitting(){
            var self = this;
            self.isWaitting = !self.isWaitting;
      }
    }
};
</script>

<style>
</style>
