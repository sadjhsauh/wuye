import $http from '@/utils/http'

//业主分页
export async function getLiveUserListApi(param){
    return $http.get('/liveUser/list',{
        params:param
    })
}

//添加业主
export async function addLiveUserApi(param){
    return $http.post('/liveUser',param);
}

//编辑业主
export async function editLiveUserApi(param){
    return $http.put('/liveUser',param);
}

//获取所有角色
export async function getRoleListApi(){
    return $http.get('/role/getList');
}

//查看业主回显信息
export async function getUserByIdApi(param){
    return $http.get(`/liveUser/getUserById/${param}`)
}
//获取房屋列表
export async function getHouseListApi(param){
    return $http.get('/house/list',{
        params:param
    })
}
//保存分配房屋
export async function assignHouseApi(param){
    return $http.post('/liveUser/assignHouse',param);
}

//退房
export async function returnHouseApi(param){
    return $http.post('/liveUser/returnHouse',param);
}
//删除
export async function deleteUserApi(userId,houseId){
    if(houseId && houseId!=''){
        return $http.delete(`/liveUser/${userId}/${houseId}`);
    }else {
        return $http.delete(`/liveUser/${userId}`);
    }
}
