// 导入布局路由
import Layout from '@/layout'
// 导出 审批的路由规则
export default {
  path: '/departments', // 路径 一级路由
  name: 'departments', // 给路由加一个name
  component: Layout, // layout组件
  // 配置二级路径的路由表
  children: [
    {
      path: '', // 默认二级路由地址,访问一级路由会默认进入该路由
      component: () => import('@/views/departments'),
      meta: { // 路由元信息
        title: '组织架构', // title表示则侧导航菜单文字
        icon: 'tree'

      }
    }
  ]
}
