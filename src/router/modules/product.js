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
const product = () => import('@/views/product/product.vue')
const productSpec = () => import('@/views/product/productSpec.vue')
const categoryBrand = () => import('@/views/product/categoryBrand.vue')
const brand = () => import('@/views/product/brand.vue')
const category = () => import('@/views/product/category.vue')

export default [
  {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: {
      title: '商品管理',
    },
    icon: 'User',
    children: [
      {
        path: '/product',
        name: 'product',
        component: product,
        meta: {
          title: '商品列表',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/productSpec',
        name: 'productSpec',
        component: productSpec,
        meta: {
          title: '商品规格',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/categoryBrand',
        name: 'categoryBrand',
        component: categoryBrand,
        meta: {
          title: '分类品牌',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/brand',
        name: 'brand',
        component: brand,
        meta: {
          title: '品牌管理',
          affix: false,
        },
        icon: 'User',
      },
      {
        path: '/category',
        name: 'category',
        component: category,
        meta: {
          title: '分类管理',
          affix: false,
        },
        icon: 'User',
      },
    ],
  },
]
