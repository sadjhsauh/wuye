import $http from '@/utils/http'

//获取角色列表
export async function getRoleListApi(param){
    return await $http.get("/role/list",{
        params:param
    });
}

//新增角色
export async function addRoleApi(param){
    return await $http.post("/role",param);
}

//修改角色
export async function editRoleApi(param){
    return await $http.put("/role",param);
}

//删除角色
export async function deleteRoleApi(param){
    return await $http.delete(`/role/${param}`);
}

//获得分配权限菜单
export async function getAssignTreeApi(param){
    return await $http.get(`/role/getAssignTree/${param}`);
}

//保存角色拥有的权限信息
export async function saveMenuIdsByRoleIdApi(param){
    return await $http.put(`/role/saveMenuIdsByRoleId`,param);
}
