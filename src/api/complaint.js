import $http from '@/utils/http'

//获取投诉列表
export async function getListApi(param){
    return await $http.get("/complaint/list",{
        params:param
    });
}

//新增投诉
export async function addComplaintApi(param){
    return await $http.post("/complaint",param);
}

//编辑投诉
export async function editComplaintApi(param){
    return await $http.put("/complaint",param);
}

//删除投诉
export async function deleteComplaintApi(param){
    return await $http.delete(`/complaint/${param}`);
}
//我的投诉列表
export async function getMyListApi(param){
    return await $http.get("/complaint/myList",{
        params:param
    });
}