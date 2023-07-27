import $http from '@/utils/http'

//查询列表
export async function getFeeWaterListApi(param){
    return await $http.get('/feeWater/list',{
        params:param
    })
}

//添加水费
export async function addFeeWaterApi(param){
    return await $http.post('/feeWater',param);
}

//编辑水费
export async function editFeeWaterApi(param){
    return await $http.put('/feeWater',param);
}

//删除水费
export async function deleteFeeWaterApi(param){
    return await $http.delete(`/feeWater/${param}`)
}

//缴费
export async function payFeeWaterApi(param){
    return await $http.post("/feeWater/payWater",param)
}

//查询所有楼栋
export async function getBuildFindAllApi(){
    return await $http.get('/build/findAll')
}

//根据楼栋id查询单元列表
export async function getUnitListByBuildIdApi(param){
    return await $http.get(`/unit/getUnitListByBuildId/${param}`)
}

//根据单元id查询房屋列表
export async function getHouseListByUnitIdApi(param){
    return await $http.get(`/house/getHouseByUnitId/${param}`)
}