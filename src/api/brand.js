import request from '@/utils/request'

const api_name = '/admin/product/brand'

export const GetBrandPageList = (page, limit) => {
  return request({
    url: `/admin/product/brand/getBrandPageList/${page}/${limit}`,
    method: 'get',
  })
}
