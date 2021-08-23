import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'

const TimeOut = 3600// 时间单位s

// 检查是否超时函数
function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 统一注入token
    if (store.getters.token) {
      // 主动介入token处理的业务逻辑
      // 有token的前提下,才要去检查时间戳是否过期了
      if (IsCheckTimeOut()) {
        // 清空token和用户信息
        store.dispatch('user/logout')
        // 跳转登录页
        router.push('/login')
        // 返回提示token过期消息
        return Promise.reject(new Error('token过期了,请重新登录'))
      }

      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  }, err => {
    return Promise.reject(err)
  }
)

// 响应拦截器 解构数据和处理错误响应
service.interceptors.response.use(
  (response) => {
    // 响应成功回调函数
    const { data, message, success } = response.data
    if (success) {
      // 没有错误
      return data
    } else {
      // 业务逻辑有错误,直接返回错误
      Message.error(message)// 提示错误信息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 响应失败回调函数
    if (error.response && error.response.data && error.response.data.code === 1002) {
      // 清空token和用户信息
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
    } else {
      // 提示错误信息
      Message.error(error.message)
    }
    return Promise.reject(error)// 返回执行错误
  }
)

// 暴露实例
export default service
