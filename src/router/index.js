import { createRouter, createWebHashHistory } from 'vue-router'
//布局文件
import LayOut from '../views/LayOut/LayOut.vue'
import store from "@/store"



// 路由配置
const routes = [
  //默认跳转
  {
    hidden:true,
    path: "/",
    redirect: "login",
  },
  // 登陆页面
  {
    hidden:true,
    path: "/login",
    name: "login",
    component: () => import("../views/pages/login.vue")
  },
  //后台
  {
    path: "/console",
    name: "console",
    index:"0",
    meta:{
      name:'控制台',
      icon:'console',
    },
    component: LayOut,
    redirect: "/account",
    // 子路由/嵌套路由
    children: [
      {
        index:"0-0",
        meta:{
          name:'首页',
        },
        path: "/index",
        name: "首页",  //欢迎页面
        component: () => import("../views/Console/index.vue")
      },
      


    ]
  },
  {
    path: "/order",
    name: "order",
    index:"1",
    meta:{
      name:'订单管理',
      icon:'info',
    },
    component: LayOut,
    redirect: "/productList",
    // 子路由/嵌套路由
    children: [
      
      {
        index:"1-0",
        meta:{
          name:'订单列表',
        },
        path: "/orderList",
  
        component: () => import("../views/Order/orderList.vue")
      },
    ]
  },
  {
    index:"2",
    meta:{
      name:'账号管理',
      icon:'user',
    },
    path: "/account",
    name: "account",
    
    component: LayOut,
    redirect: "/index",
    // 子路由/嵌套路由
    children: [
      {
        index:"2-0",
        meta:{
          name:'账号列表',
        },
        path: "/account",
        name: "账号列表",
        component: () => import("../views/Account/accountList.vue")
      },
    ]
  },
  {
    index:"3",
    meta:{
      name:'产品管理',
      icon:'info',
    },
    path: "/product",
    name: "product",
    
    component: LayOut,
    redirect: "/productList",
    // 子路由/嵌套路由
    children: [
      {
        index:"3-0",
        meta:{
          name:'产品列表',
        },
        path: "/productList",
        name: "产品列表",
        component: () => import("@/views/Product/productList.vue")
      },
    ]
  },
 
 


]
// 生成hash路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})



const tokenIsExpire = (uInfo)=>{
  let gap = 10;
  var timestamp = Math.floor(Date.now() / 1000);
    if( (uInfo.now + uInfo.expire*60) < (timestamp +gap)){
       return true;
    }
    return false;
} 

const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}



router.beforeEach((to, form, next) => {
  /**
   * to:从哪个页面
   * from:到哪个页面
   * next:只有执行next()页面才会进行跳转
   */
  // 判断用户是否登录

  let uInfo = store.getters['getUserInfo'];
  console.log('uInfo',uInfo);

  if(!isObjectEmpty(uInfo) && tokenIsExpire(uInfo)){
    //store.commit("setUserInfo", {});
    //uInfo = {};
  }


  if (!uInfo.access_token) {
    // 未登录,跳转到login 
    if (to.path === "/login") {
      next()
      return
    }
    next("/login")

  } else {

    next()
  }

})
// 暴露路由对象
export default router
