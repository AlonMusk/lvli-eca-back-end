import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index.ts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import "virtual:svg-icons-register"



import SvgIcon from "./assets/icons/SvgIcon.vue";


const app = createApp(App);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app
  .use(router)
  .use(store)
 
  .use(ElementPlus, { locale: zhCn })
  // use(ElementPlusIconsVue).
  .component("svg-icon", SvgIcon)
  .mount('#app');
