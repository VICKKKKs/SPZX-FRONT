import request from '@/utils/request'

const api_name = '/admin/product/category'

// 根据parentId获取下级节点
export const FindCategoryByParentId = parentId => {
  return request({
    url: `/admin/product/category/findByParentId/${parentId}`,
    method: 'get',
  })
}

export const ExportCategoryData = () => {
  return request({
    url: `/admin/product/category/exportCategoryData`,
    method: 'get',
    responseType: 'blob',
  })
}
