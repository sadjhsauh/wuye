import $http from '@/utils/http'

//楼栋分页
export async function getBuildListApi(param){
    return $http.get('/build/list',{
        params:param
    })
}

//添加楼栋
export async function addBuildApi(param){
    return $http.post('/build',param);
}

//编辑楼栋
export async function editBuildApi(param){
    return $http.put('/build',param);
}

//删除楼栋
export async function deleteBuildApi(param){
    return $http.delete(`/build/${param}`)
}