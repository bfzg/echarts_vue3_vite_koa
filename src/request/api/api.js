import http from '../index';

// export function getDataList (){
//     return http({
//         method:'get',
//         url:"/api/map"
//     })
// }
export function getSellerData (){
    return http({
        method:'get',
        url:"/seller"
    })
}