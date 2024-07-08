<template>
    <div id="header-wrap" class="navbar">
        <div class=" user-info">
            <img class="header-img " src="../../../assets/images/face.jpg" alt="">
            <span>
                {{ username }}
            </span>
            <!-- <div> -->
            <DropdownButton @clickchild="clickEven"></DropdownButton>
            <!-- </div> -->

            <!-- <el-button  @click="logout">退出登录</el-button> -->
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
import DropdownButton from '@/components/Dropdown/DropdownButton.vue';
import { logoutApi } from "@/utils/request.ts";
import { ElMessage } from 'element-plus';
export default defineComponent({
    name: 'layoutHeader',
    components: {
        DropdownButton,
    },
    setup() {
        const store = useStore()
        const username = computed(() => '你好');//store.state.app.username);
        const navMenuState = () => {
            store.commit('SET_COLLAPSE')
        }

        const router = useRouter()
        // 退出
        const logout = () => {

            // logoutApi
            logoutApi().then((res) => {
                console.log('退出登录', res);
				
				//token 已过期  Token has expired
				
                let data = res;
                if (data.code ==401 ||(data.code != undefined && data.code == 200)) {
                    localStorage.removeItem("loginData")
                    store.commit("SET_ROLES", 0);
                    store.commit('setUserInfo', {});
                    router.push({
                        path: "/login"
                    })
                }
                return true;
            }).catch(res => {
            localStorage.removeItem("loginData")
            store.commit("SET_ROLES", 0);
            store.commit('setUserInfo', {});
            router.push({
                path: "/login"
            })
        })
		}

        const clickEven = (val) => {
            console.log("子组件传递的消息：", val);
            logout();
            //result.value=val.content
        };

        return {
            navMenuState,
            username,
            logout,
            clickEven
        }
    }
})
</script>
<style lang="scss" scoped>
@import "../../../styles/main.scss";

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;

    justify-content: space-between;

}

.navbar {
    display: flex;
    justify-content: flex-end;
}

.navbar .user-info {
    display: flex;
    align-items: center;
    margin-left: auto;
}

.navbar .user-info img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 8px;
}

.navbar .user-info span {
    font-size: 14px;
    font-weight: bold;
}

/* 可选的额外样式 */
.navbar {
    height: 60px;
    background-color: #f0f0f0;
    padding: 0 20px;
}

#header-wrap {
    position: fixed;
    top: 0;
    right: 0;
    left: $navMenu;
    height: $layoutHeader;
    background-color: #fff;
    line-height: 75px;
    @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, .1));
    @include webkit(transition, all .3s ease 0s);
}
</style>