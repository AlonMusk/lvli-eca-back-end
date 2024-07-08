<template>
    <div id="nav-wrap">
        <h1 class="logo"><img src="../../../assets/images/logo.png" alt=""></h1>


        <el-menu default-active="defalutActive" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
            @close="handleClose" background-color="transparent" text-color="#fff" active-text-color="#fff" router="true">

            <template v-for="(item, index) in routers">
                <el-sub-menu v-if="!item.hidden && item.children && item.children.length > 0" :key="item.index"
                    :index="item.index">

                    <!-- 一级菜单 -->
                    <template #title>

                        <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
                        <span>{{ item.meta.name }}</span>
                    </template>

                    <!-- 子级菜单 -->

                    <el-menu-item v-for="(subItem, subIndex) in item.children" :key="subItem.index" :index="subItem.path">
                        {{ subItem.meta.name }}
                    </el-menu-item>





                </el-sub-menu>



            </template>

        </el-menu>
    </div>
</template>

<script lang="ts" >
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from "vuex"
export default {
    name: "navMenu",
    setup() {
        const router = useRouter();
        //data数组
        let routers = reactive(router.options.routes);

        const store = useStore();
        const uInfo = store.getters['getUserInfo'];
        const role = uInfo.role;

        if(false && role != 1){
            //过滤掉账号管理
             routers = router.options.routes.filter(item => item.index != "2");
        //console.log('test:',test);
        }

        console.log('nav.vue:', routers);

        /**
        * computed 监听
        */
        const isCollapse = ref(false);
        /**
              * 监听路由变化
              */
        const defalutActive = computed(() => {
            const { path } = router;
            return path;
        })

        //console.log(root);
        const handleOpen = (key, keyPath) => {
            // console.log(key, keyPath)
        }
        const handleClose = (key, keyPath) => {
            // console.log(key, keyPath)
        }

        return {
            router,
            routers,
            isCollapse,
            defalutActive,
            handleOpen,
            handleClose
        }

    }

}
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";

.logo {
    text-align: center;
    height: $layoutHeader;
    margin: 0px;
}

.logo>img {
    // margin: 28px auto 25px;
    width: 50px;
    height: $layoutHeader;
    @include webkit(transition, all .3s ease 0s);
}

#nav-wrap {
  
    position: fixed;
    top: 0px;
    // left:$navMenu;
    left: 0px;
    height: 100vh;
    width: $navMenu;
    background-color: #344a5f;
    overflow-y: scroll;
    @include webkit(transition, all .3s ease 0s);

    svg {
        font-size: 20px;
        margin-right: 10px;
    }
}
.el-menu-vertical-demo{
    padding-right: 18px;
    width: 251px;
}
</style>