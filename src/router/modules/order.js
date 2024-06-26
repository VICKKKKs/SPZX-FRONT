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
const orderInfo = () => import('@/views/order/orderInfo.vue')
const orderStatistics = () => import('@/views/order/orderStatistics.vue')

export default [
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: '订单管理',
    },
    icon: 'User',
    children: [
      {
        path: '/orderInfo',
        name: 'orderInfo',
        component: orderInfo,
        meta: {
          title: '订单列表',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/orderStatistics',
        name: 'orderStatistics',
        component: orderStatistics,
        meta: {
          title: '订单统计',
          affix: false,
        },
        icon: 'User',
      },
    ],
  },
]
