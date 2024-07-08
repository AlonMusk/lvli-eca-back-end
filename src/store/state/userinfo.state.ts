export default {
    state: {
        userInfo: (localStorage.getItem("loginData") && JSON.parse(localStorage.getItem("loginData"))) || {},
        roles: [],
        isCollapse:0,
        sub_img:[],
		   sub_img2:[],
        main_img:"",
		    content:"",
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        roles(state) {
            return state.roles;
        } ,
        isCollapse(state) {
            return state.isCollapse;
        },
        getMainImage(state){
            return state.main_img;
        },
        getSubImage(state){
            return state.sub_img;
        },
		getSubImage2(state){
		    return state.sub_img2;
		},
		getContent(state){
		    return state.content;
		},
    },
    mutations: {
        setMainImage(state, value){
            state.main_img = value;
        },
        setSubImage(state, value){
            state.sub_img = value;
        },
		setSubImage2(state, value){
		    state.sub_img2 = value;
		},
		setContent(state, value){
		    state.content = value;
		},

        SET_COLLAPSE(state) {
            state.isCollapse = !state.isCollapse;
            // html5本地储存
            localStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
        },
        SET_ROLES(state, value) {
            state.roles = value;
        },
    
        SET_ROUTES: (state: State, routes: Array<any>) => {
            state.routes = routes;
        },

        setUserInfo(state, uInfo) {
            if (Object.keys(uInfo).length === 0) {
                console.log('clear');
                localStorage.removeItem('loginData');
                state.roles = [];
            }
            state.userInfo = uInfo;
            //state.roles = (uInfo.role ==1)?['admin']:[];
            console.log('setUserInfo:', uInfo);
        }
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit }: ActionContext<any, any>) {
            return new Promise(resolve => {

                // 向后端请求路由数据

                let accessedRoutes = [
                    {
                        "name": "system",
                        "path": "/system",
                        "hidden": false,
                        "redirect":"noRedirect",
                        "component": "system/user/index",
                        "alwaysShow":true,
                        "meta": {
                            "title": "用户管理",
                            "icon": "iconsearch",
                            "noCache": false,
                        },
                        "children": [
                            {
                                "name": "/system/user",
                                "path": "/system/user",
                                "hidden": false,
                                "component": "system/user/index",
                                "meta": {
                                    "title": "用户管理",
                                    "icon": "iconsearch",
                                    "noCache": false,
                                },
                            },
                        ],
                    },

                ];
                accessedRoutes = indexChildRoutes.concat(accessedRoutes)
                // accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });

                commit("SET_ROUTES", accessedRoutes);
                // console.log(accessedRoutes)
                resolve(accessedRoutes);

            });
        },
    }
}