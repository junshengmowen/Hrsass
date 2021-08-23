import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { getUserInfo, login, getUserDetailById } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {} // 用户信息
}

const mutations = {
  // 存储token
  setToken(state, token) {
    state.token = token// 将请求回来的token交给state存储
    setToken(token)// token持久化进行cookie存储
    setTimeStamp()// 存入时间戳
  },
  // 清空token
  removeToken(state) {
    state.token = null
    removeToken()// 清除本地存储
  },
  // 设置用户信息
  setUserInfo(state, data) {
    state.userInfo = data
  },
  // 删除用户信息--为了退出删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }

}

const actions = {
  // 登录请求
  async login(context, data) {
    const token = await login(data)
    context.commit('setToken', token)
  },
  // 获取用户信息请求
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // 将用户全部的个人信息设置到用户的vuex数据中
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return res
  },
  // 退出
  logout(context) {
    // 01.删除用户token
    context.commit('removeToken')
    // 02.清空用户信息
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

