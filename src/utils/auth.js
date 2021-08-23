import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const TimeKey = 'ue_admin_template_time'
// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 移除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
