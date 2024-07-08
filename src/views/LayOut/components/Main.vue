<template>
    <div id="main-wrap">
        <router-view />
    </div>
</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";

#main-wrap {
    padding-left: 75px;
    /* width:100vh;
    height: 100vh;
     padding: 75px 0 0 250px; */
    position: fixed;
    left: $navMenu;
    top: 60px;
    right: 0px;
    bottom: 0px;
    border: 3px solid #f7f7f7;

    -webkit-box-sizing: border;
    overflow-y: scroll;
}
</style>