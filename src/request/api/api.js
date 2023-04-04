import http from '../index';

// export function getDataList (){
//     return http({
//         method:'get',
//         url:"/api/map"
//     })
// }
export function getSellerData (value){
    return http({
        method:'get',
        url:"/"+value
    })
}