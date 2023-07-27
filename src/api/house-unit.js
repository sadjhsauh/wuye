import $http from '@/utils/http'

//单元分页
export async function getUnitListApi(param){
    return $http.get('/unit/list',{
        params:param
    })
}

//添加单元
export async function addUnitApi(param){
    return $http.post('/unit',param);
}

//编辑楼栋
export async function editUnitApi(param){
    return $http.put('/unit',param);
}

//删除楼栋
export async function deleteUnitApi(param){
    return $http.delete(`/unit/${param}`)
}

//查询所有楼栋
export async function getBuildFindAllApi(){
    return $http.get('/build/findAll')
}

