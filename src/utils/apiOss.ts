import { post, get, put, del } from "./service.ts"


// 获取
export const OssPolicyApi = data => {
 
    return get({
        url: "/ossPolicy",
        data
    })
}



