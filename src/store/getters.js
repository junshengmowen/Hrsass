const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 创建了token的快捷访问方式
  userId: state => state.user.userInfo.userId, // 建立用户id名称的映射
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  staffPhoto: state => state.user.userInfo.staffPhoto // 建立用户头像的映射
}
export default getters
