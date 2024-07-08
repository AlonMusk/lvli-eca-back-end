import { post, get, put, del } from "./service.ts"


// 获取列表
export const AccountListApi = data => {
 
    return get({
        url: "/account/userList",
        data
    })
}


export const EditAccountApi = data => {
 
    return post({
        url: "/add_user",
        data
    })
}

export const DelAccountApi = data => {
 
    return post({
        url: "/delAccount",
        data
    })
}
