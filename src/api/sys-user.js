import $http from '@/utils/http';
// 查询用户列表
export async function getUserListApi(param){
    return await $http.get('/user/list',{
        params:param
    });
}

//添加用户
export async function addUserApi(param){
    return await $http.post('/user',param);
}

//修改用户
export async function editUserApi(param){
    return await $http.put('/user',param)
}

//删除用户
export async function deleteUserApi(param){
    return await $http.delete(`/user/${param}`);
}

//查询所有角色并选中用户拥有的角色
export async function checkRolesApi(param){
    return await $http.get(`/user/checkRoles/${param}`);
}
//保存用户拥有的角色Id
export async function saveRoleIdsByUserIdApi(param){
    return await $http.put('/user/saveRoleIdsByUserId',param);
}