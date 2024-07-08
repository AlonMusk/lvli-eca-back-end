<template>
    <div id="layout">

        <LayoutHeader />
        <LayoutMain />
        <LayoutNav />

    </div>
</template>
<script lang="ts" setup>
import LayoutHeader from './components/Header.vue';
import LayoutMain from './components/Main.vue';
import LayoutNav from './components/Nav.vue';


</script> 
<style scoped>
#layout {
    background-color: #f7f7f7;
    ;
}

.el-container {
    height: 100vh;
    overflow: hidden;
}

.common-header {
    background: rgb(39, 45, 53);
}

.common-aside {
    background: rgb(48, 55, 65);
}

.logo {
    width: 80px;
}

.title {
    color: #fff;
}

.el-main {
    background: #efefef;
}</style>