import { createStore } from 'vuex'
import number from "./state/num.state.ts"
import uInfo from "./state/userinfo.state.ts"

import permission from "./permission.js";

export default createStore({

  // 数据比较多,分模块
  modules: {
    
    number,
    uInfo,
    permission
  }
})
