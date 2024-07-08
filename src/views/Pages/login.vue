<template>
  <div class="">

    <h2 style="color: #fff;">欢迎来到 饮酒令后台 !</h2>

    <el-form :label-position="labelPosition" label-width="0px" :model="loginData" style="max-width: 460px">

      <el-form-item label="" :rules="[
        {
          required: true,
          message: '此项为必填项',
          trigger: 'blur',
        },]">
        <el-input v-model="loginData.username" placeholder="请输入用户名" class="el-input" />
      </el-form-item>

      <el-form-item label="" :rules="[
        {
          required: true,
          message: '此项为必填项',
          trigger: 'blur',
        },]">
        <!-- <el-input type="password" v-model="loginData.password" class="el-input" /> -->
        <el-input v-model="loginData.password" type="password" placeholder="请输入密码" show-password class="el-input" />
      </el-form-item>

      <el-form-item label="">


        <el-button type="primary" round @click="handleLogin" class="el-btn">登录</el-button>

      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { loginApi } from "@/utils/request.ts";

const store = useStore();
const router = useRouter();
const count = store.state.number.count;

const labelPosition = ref("right");

const loginData = reactive({
  username: "admin",
  password: "12345678",
  code: "",
  num: count,
});

let bodyElement= '';

console.log('login.vue');

//store.commit("setUserInfo", {});


const tokenIsExpire = (uInfo)=>{
  let gap = 10;
  var timestamp = Math.floor(Date.now() / 1000);
    if( (uInfo.now + uInfo.expire*60) < (timestamp +gap)){
       return true;
    }
    return false;
} 

onMounted(() => {
  bodyElement = document.querySelector('body');
  bodyElement.style.backgroundColor = 'rgb(41,85,146)';//'rgb(44,121,225)';
  bodyElement.style.backgroundImage = '/src/assets/images/login-back.jpg';


  let loginStore = store.getters['getUserInfo'];
  console.log('已保存登录信息：', loginStore);
  

  if (Object.keys(loginStore).length > 0) {
	    if(!tokenIsExpire(loginStore)){
        bodyElement.style.backgroundColor = '';
    bodyElement.style.backgroundImage = '';
    // 跳转/user
    router.push({
      path: "/account"
    })
    console.log("已有保存登录信息，并且已跳转到控制台");
      }
    
  }else{
    bodyElement.style.backgroundColor = 'rgb(41,85,146)';//'rgb(44,121,225)';
  bodyElement.style.backgroundImage = '/src/assets/images/login-back.jpg';

  }
});


const handleLogin = () => {
  // 请求后台接口
  // 默认用户：admin/123456
  loginApi(loginData).then((res) => {
    console.log(res);
    const data = res.data;
    if (res.code ==200) {
      store.commit("setUserInfo", data);

      // localStorage 手动清除
      localStorage.setItem("loginData", JSON.stringify(data));

      bodyElement.style.backgroundColor = '';
      bodyElement.style.backgroundImage = '';
      // 跳转/user
      router.push({
        path: "/account",
      });
    }
  });
};

</script>

<style scoped >
.el-input {
  height: 48px;
  line-height: 48px;
}

.el-btn {
  width: 100%;
  height: 50px;
}
</style>
