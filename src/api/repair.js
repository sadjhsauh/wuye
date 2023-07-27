import $http from '@/utils/http'

//获取维修列表
export async function getListApi(param){
    return await $http.get("/repair/list",{
        params:param
    });
}

//新增维修
export async function addRepairApi(param){
    return await $http.post("/repair",param);
}

//编辑维修
export async function editRepairApi(param){
    return await $http.put("/repair",param);
}

//删除维修
export async function deleteRepairApi(param){
    return await $http.delete(`/repair/${param}`);
}
//我的维修列表
export async function getMyListApi(param){
    return await $http.get("/repair/myList",{
        params:param
    });
}

//删除视频
export async function deleteVideoApi(param){
    return await $http.delete(`/video/${param}`);
}


