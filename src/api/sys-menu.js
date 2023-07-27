import $http from '@/utils/http'

//获取菜单列表
export async function getMenuListApi(){
    return await $http.get("/menu/list");
}
//获取菜单父列表
export async function getMenuParentListApi(){
    return await $http.get("/menu/parent");
}

//新增菜单
export async function addMenuApi(param){
    return await $http.post("/menu",param);
}

//修改菜单
export async function editMenuApi(param){
    return await $http.put("/menu",param);
}

//删除菜单
export async function deleteMenuApi(param){
    return await $http.delete(`/menu/${param}`);
}