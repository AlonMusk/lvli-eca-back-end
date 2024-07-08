import { post, get, put, del } from "./service.ts"


// 获取订单列表
export const OrderListApi = data => {
 
    return get({
        url: "/order/orderList",
        data
    })
}

export const RefundApi = data => {
 
    return post({
        url: "/order/orderRefund",
        data
    })
}

export const GetList = data => {
 
    return get({
        url: "/orderList",
        data
    })
}


export const AddInfo = data => {
 
    return get({
        url: "/orderList",
        data
    })
}

export const EditOrderApi = data => {
 
    return post({
        url: "/editOrder",
        data
    })
}
