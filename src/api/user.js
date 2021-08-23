import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'Post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/** *
 *
 * 获取用户的基本信息
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {}
