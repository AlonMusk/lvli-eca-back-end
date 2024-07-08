
//import {defaultRouterMap,  asnycRouterMap } from "@/router/index.js"


// import store from "@/store"

import * as Layout from '@/views/Layout/LayOut.vue'

console.log('permission');
// import { useRouter } from "vue-router"
// const router = useRouter();

// const defaultRouterMap = router.defaultRouterMap;
// const asnycRouterMap = router.asnycRouterMap;

// const uInfo = store.getters['getUserInfo'];
// const role = uInfo.role;



function hasPremission(roles, router) {
    if (router.meta && router.meta.role) {
        return roles.some(item => router.meta.role.indexOf(item) >= 0)
    }
}
const state = {
    defaultRouterMap: [],
    asnycRouterMap:[],
    role: 0,
    allRouters: [],
    addRouters: [],

}

const getters = {
    allRouters: state => state.allRouters,  // 所有的
    addRouters: state => state.addRouters,  // 匹配的
    role: state => state.role,
    asnycRouterMap:state => state.asnycRouterMap,
}

const mutations = {  // 必须的  同步 没有回调处理事情
    SET_ALLROUTERS(state, router) {
        state.allRouters = router;
        state.defaultRouterMap = router;
    },
    SET_ROUTER(state, router) {
        state.addRouters = router
        state.allRouters = state.defaultRouterMap.concat(router)
    },
    SET_ROLE(state, role) {
        state.role = role
    },
    SET_ASNYCROUTERMAP(state, asnycRouterMap) {
        state.asnycRouterMap = asnycRouterMap
    }
}

const actions = {  // 可以回调处理事情 


    /**
     * 创建动态路由
     */
    createRouter({ commit }, data) {

        const asnycRouterMap = state.asnycRouterMap;
        
        console.log('state.defaultRouterMap:', state.defaultRouterMap);
        console.log('asnycRouterMap:', asnycRouterMap);
        console.log('createRouter data:', data);
        return new Promise((resolve, reject) => {
            // ["infoSystem", "userSystem"]
            let role = data;
            // 超管的状态
            let addRouters = []
            if (role.includes('admin')) {
                addRouters = asnycRouterMap
            } else { // 普通管理员 
                addRouters = asnycRouterMap.filter(item => {
                    if (hasPremission(role, item)) {
                        // 优先判断 
                        if (item.children && item.children.length > 0) {
                            item.children = item.children.filter(child => {
                                if (hasPremission(role, child)) {
                                    return child;
                                }
                            })
                            return item;
                        }
                        return item;
                    }
                })
                addRouters.push(asnycRouterMap[asnycRouterMap.length - 1]);
            }
            // 更新路由
            commit('SET_ROUTER', addRouters);
            resolve()
        })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
