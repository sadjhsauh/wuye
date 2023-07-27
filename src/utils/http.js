import axios from 'axios'
import {Message,MessageBox} from 'element-ui'
//路径前缀
axios.defaults.baseURL='http://127.0.0.1:8888/api/'

//请求发送之前的拦截器
axios.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("authorization")
    //如果token存在，把token添加到请求的头部
    if (token) {
      config.headers['authorization'] = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)


//请求返回之后的处理
axios.interceptors.response.use(

  response => {
    if(response.headers.authorization){
        sessionStorage.setItem("authorization",response.headers.authorization)
    }
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.msg || '服务器出错',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || '服务器出错'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) 
    Message({
      message: error.msg || '服务器出错!',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

let $http = axios;
export default $http;
