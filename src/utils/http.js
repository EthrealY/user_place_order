// //axios的基础封装
// import axios from 'axios';

// //创建实例
// const httpInstance = axios.create({
//     //根域名配置
//     baseURL: 'http://127.0.0.1:8080',
//     //超时时间
//     timeout: 5000
// })


// //拦截器
// //请求拦截器
// httpInstance.interceptors.request.use(config => {
//     return config
// }, e => Promise.reject(e));
// //响应拦截器
// httpInstance.interceptors.response.use(res => res.data,
//     e => { return Promise.reject(e) });
// export default httpInstance
