import $http from '@/utils/http'

//房屋分页
export async function getHouseListApi(param){
    return $http.get('/house/list',{
        params:param
    })
}

//添加房屋
export async function addHouseApi(param){
    return $http.post('/house',param);
}

//编辑房屋
export async function editHouseApi(param){
    return $http.put('/house',param);
}

//删除房屋
export async function deleteHouseApi(param){
    return $http.delete(`/house/${param}`)
}

//查询所有楼栋
export async function getBuildFindAllApi(){
    return $http.get('/build/findAll')
}

//根据楼栋id查询单元列表
export async function getUnitListByBuildIdApi(param){
    return $http.get(`/unit/getUnitListByBuildId/${param}`)
}


