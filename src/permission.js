import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']// 白名单,没有权限的页面
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      // 手动切换路由,让其跳转到主页
      next('/')
    } else {
      // 调取vuex中的actions,获取用户资料
      await store.dispatch('user/getUserInfo')
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 在白名单中,则放行通过
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done()
})
router.afterEach((to, from) => {
  NProgress.done()
})
