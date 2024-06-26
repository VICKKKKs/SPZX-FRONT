/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-24 19:27:21
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
// home.js
const Layout = () => import('@/layout/index.vue')
const userInfo = () => import('@/views/users/userInfo.vue')

export default [
  {
    path: '/users',
    component: Layout,
    name: 'users',
    meta: {
      title: '会员管理',
    },
    icon: 'User',
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        component: userInfo,
        meta: {
          title: '会员列表',
          affix: false,
        },
        icon: 'User',
      },
    ],
  },
]
