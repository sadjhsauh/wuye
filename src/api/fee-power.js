import $http from '@/utils/http'

//查询列表
export async function getFeePowerListApi(param){
    return await $http.get('/feePower/list',{
        params:param
    })
}

//添加电费
export async function addFeePowerApi(param){
    return await $http.post('/feePower',param);
}

//编辑电费
export async function editFeePowerApi(param){
    return await $http.put('/feePower',param);
}

//删除电费
export async function deleteFeePowerApi(param){
    return await $http.delete(`/feePower/${param}`)
}

//缴费
export async function payFeePowerApi(param){
    return await $http.post("/feePower/payPower",param)
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