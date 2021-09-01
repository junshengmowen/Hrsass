// 导入布局路由
import Layout from '@/layout'

// 导出 审批的路由规则
export default {
  path: '/employees', // 路径 一级路由
  name: 'employees', // 给路由加一个name
  component: Layout, // layout组件
  // 配置二级路径的路由表
  children: [
    {
      path: '', // 默认二级路由地址,访问一级路由会默认进入该路由
      component: () => import('@/views/employees'),
      meta: { // 路由元信息
        title: '员工管理', // title表示则侧导航菜单文字
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: { // 路由元信息
        title: '员工详情' // title表示则侧导航菜单文字
      }
    }
  ]
}

