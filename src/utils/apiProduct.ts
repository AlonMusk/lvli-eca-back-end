import { post, get, put, del } from "./service.ts"


// 获取列表
export const ProductListApi = data => {
 
    return get({
        url: "/product/spuList",
        data
    })
}


export const ProductAddApi = data => {
 
    return post({
        url: "/product/spuAdd",
        data
    })
}

export const ProductEditApi = data => {
 
    return post({
        url: "/product/spuEdit",
        data
    })
}

export const ProductDetailApi = data => {
 
    return get({
        url: "/product/spuDetail",
        data
    })
}




export const BrandListApi = data => {
 
    return get({
        url: "/product/brandList",
        data
    })
}

export const CatListApi = data => {
 
    return get({
        url: "/product/catList",
        data
    })
}


export const AttrListApi = data => {
 
    return get({
        url: "/product/attrList",
        data
    })
}


export const TagListApi = data => {
 
    return get({
        url: "/product/tagList",
        data
    })
}