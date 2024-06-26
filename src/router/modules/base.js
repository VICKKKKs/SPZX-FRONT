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
const productUnit = () => import('@/views/base/productUnit.vue')
const region = () => import('@/views/base/region.vue')

export default [
  {
    path: '/base',
    component: Layout,
    name: 'base',
    meta: {
      title: '基础数据管理',
    },
    icon: 'User',
    children: [
      {
        path: '/productUnit',
        name: 'productUnit',
        component: productUnit,
        meta: {
          title: '商品单位管理',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/region',
        name: 'region',
        component: region,
        meta: {
          title: '地区管理',
          affix: false,
        },
        icon: 'User',
      },
    ],
  },
]
