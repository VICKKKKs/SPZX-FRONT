import request from '@/utils/request'

export const GetProductSpecPageList = (page, limit) => {
  return request({
    url: `/admin/product/productSpec/getProductSpecPageList/${page}/${limit}`,
    method: 'get',
  })
}
