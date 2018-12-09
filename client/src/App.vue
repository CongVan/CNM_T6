<template>
<div id="app">
    <!--Navbar-->
    <nav class="navbar navbar-expand-lg navbar-dark  indigo darken-2">

        <!-- Navbar brand -->
        <a class="navbar-brand active" href="#">Danh sách APP</a>

        <!-- Collapse button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
    aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

        <!-- Collapsible content -->
        <div class="collapse navbar-collapse" id="basicExampleNav">

            <!-- Links -->
            <ul class="navbar-nav mr-auto">
                <router-link tag="li" to="/ghi-nhan-yeu-cau" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize " ><i class="fa fa-paper-plane-o"></i> ghi nhận yêu cầu</a>
                </router-link>
                <router-link tag="li" to="/xac-nhan-vi-tri" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize" ><i class="fa fa-map-marker"></i> Xác nhận vị trí</a>
                </router-link>
                <router-link tag="li" to="/quan-ly-yeu-cau" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize" ><i class="fa fa-th"></i> quản lý yêu cầu</a>
                </router-link>
                <router-link tag="li" to="/tai-xe" class="nav-item " active-class="active">
                    <a class="nav-link text-capitalize" ><i class="fa fa-motorcycle"></i> tài xế</a>
                </router-link>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item ml-auto" >
                    <a class="nav-link text-uppercase"><i class="fa fa-sign-out"></i> Đăng Xuất</a>
                </li>
            </ul>
        </div>
        <!-- Collapsible content -->

    </nav>
    <!--/.Navbar-->
    <router-view />
    

</div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
.my-bg-nav {
    background-image: linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cacd1 65%, #35eb93 100%);
}

.hidden {
    display: none;
}
</style>
