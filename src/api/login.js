import $http from '@/utils/http';
export async function captchaApi(){
    return await $http.post('captcha');
}
export async function loginApi(params){
    return await $http.post("login",params);
}
export async function logoutApi(){
    return await $http.post("logout");
}
export async function getInfoApi(){
    return await $http.get("getInfo");
}