import request from '@/utils/request'

const api_name = '/admin/product/brand'

export const GetBrandPageList = (page, limit) => {
  return request({
    url: `/admin/product/brand/getBrandPageList/${page}/${limit}`,
    method: 'get',
  })
}

export const SaveBrand = brand => {
  return request({
    url: `/admin/product/brand/saveBrand`,
    method: 'post',
    data: brand,
  })
}

export const UpdateBrandById = brand => {
  return request({
    url: `/admin/product/brand/updateBrandById`,
    method: 'put',
    data: brand,
  })
}

export const DeleteBrandById = id => {
  return request({
    url: `/admin/product/brand/deleteBrandById/${id}`,
    method: 'delete',
  })
}
