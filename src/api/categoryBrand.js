import request from '@/utils/request'

const api_name = '/admin/product/categoryBrand'

// 根据parentId获取下级节点
export const GetCategoryBrandPageList = (page, limit, queryDto) => {
  return request({
    url: `/admin/product/categoryBrand/getCategoryBrandPageList/${page}/${limit}`,
    method: 'get',
    params: queryDto,
  })
}

export const SaveCategoryBrand = categoryBrand => {
  return request({
    url: `/admin/product/categoryBrand/saveCategoryBrand`,
    method: 'post',
    data: categoryBrand,
  })
}

export const UpdateCategoryBrand = categoryBrand => {
  return request({
    url: `/admin/product/categoryBrand/updateCategoryBrand`,
    method: 'put',
    data: categoryBrand,
  })
}
