import { post, get, put, del } from "./service.ts"

//登录接口
export const loginApi = data => {
    return post({
        url: "/login",
        data
    })
}

//退出登录
export const logoutApi = data => {
    return post({
        url: "/logout",
        data
    })
}

// 获取通知列表
export const noticeListApi = data => {
    return get({
        url: "/home",
        data
    })
}



export const rolesDeleteApi = data => {
    return del({
        url: `roles/${data.id}`
    })
}



