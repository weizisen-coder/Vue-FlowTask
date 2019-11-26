import axios from 'axios';
import { Message,Loading } from 'element-ui';
import router from './router'

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中',
        background: 'rgba(0,0,0,0.7)'
    });
}
function endLoading() {
    loading.close()
}
//请求拦截
axios.interceptors.request.use(config => {
    //加载动画
    startLoading();
    if(localStorage.eleToken){
        //设置统一请求头
        config.headers.Authorization = localStorage.eleToken;
    }
    return config
}, error => {
    return Promise.reject(error)
})


//响应拦截
axios.interceptors.response.use(response => {
    //结束加载动画
    endLoading();
   
    return response
}, error => {
    endLoading();
    Message.error(error.response.data);
    //获取token失效的错误状态码
    const{ status } = error.response;
    if(status == 401){
        Message.error("token已失效,请重新登录");
        localStorage.removeItem('eleToken');
        //跳转
        router.push('/login');
    }
    return Promise.reject(error)
})
export default axios