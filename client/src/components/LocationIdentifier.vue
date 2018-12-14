<template>
    <div>
        <div class="container-fluid">
            <div class="row mt-2">

                <div class="col-md-4 col-sm-12">
                    <h2 class="mb-1 text-primary">Danh sách yêu cầu <span class="badge  badge-danger badge-pill ">1</span></h2>
                    <div class="row px-md-3 list-req ">
                        <div class="scrollbar scrollbar-lady-lips">
                            <div class="force-overflow"></div>
                        </div>
                        <div :id="'item_id'" class="col-md-12  hoverable rounded pt-2 card mb-2">
                            <p class="dark-grey-text mb-0 ">
                                <strong><i class="fa fa-clock-o"></i>14/12/2018</strong>
                                <strong class="ml-2 float-right text-primary"><i class="fa fa-phone"></i>0908327778</strong>
                            </p>
                            <a>
                                <span><i class="fa fa-user-circle-o text-info mr-1"></i>Mau Luu</span><br>
                                <span><i class="fa fa-address-book-o text-info mr-1"></i>227 NVC Q5</span>
                            </a>
                            <div class="d-flex justify-content-between">
                                <!-- <span><i class="fa fa-sticky-note-o text-info mr-1"></i> <span>{{req.note}}</span></span> -->

                            </div>
                        </div>
                         <div :id="'item_id'" class="col-md-12  hoverable rounded pt-2 card mb-2">
                            <p class="dark-grey-text mb-0 ">
                                <strong><i class="fa fa-clock-o"></i>14/12/2018</strong>
                                <strong class="ml-2 float-right text-primary"><i class="fa fa-phone"></i>0908327778</strong>
                            </p>
                            <a>
                                <span><i class="fa fa-user-circle-o text-info mr-1"></i>Mau Luu</span><br>
                                <span><i class="fa fa-address-book-o text-info mr-1"></i>227 NVC Q5</span>
                            </a>
                            <div class="d-flex justify-content-between">
                                <!-- <span><i class="fa fa-sticky-note-o text-info mr-1"></i> <span>{{req.note}}</span></span> -->

                            </div>
                        </div>
                         <div :id="'item_id'" class="col-md-12  hoverable rounded pt-2 card mb-2">
                            <p class="dark-grey-text mb-0 ">
                                <strong><i class="fa fa-clock-o"></i>14/12/2018</strong>
                                <strong class="ml-2 float-right text-primary"><i class="fa fa-phone"></i>0908327778</strong>
                            </p>
                            <a>
                                <span><i class="fa fa-user-circle-o text-info mr-1"></i>Mau Luu</span><br>
                                <span><i class="fa fa-address-book-o text-info mr-1"></i>227 NVC Q5</span>
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
export default {
    name:"LocationIdentifier",
     beforeCreate(){
        document.body.className = ` `;
    },
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
