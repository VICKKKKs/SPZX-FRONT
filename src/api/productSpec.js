import request from '@/utils/request'

export const GetProductSpecPageList = (page, limit) => {
  return request({
    url: `/admin/product/productSpec/getProductSpecPageList/${page}/${limit}`,
    method: 'get',
  })
}

// 保存信息
export const SaveProductSpec = productSpec => {
  return request({
    url: `/admin/product/productSpec/save`,
    method: 'post',
    data: productSpec,
  })
}

// 修改信息
export const UpdateProductSpec = productSpec => {
  return request({
    url: `/admin/product/productSpec/updateById`,
    method: 'put',
    data: productSpec,
  })
}

// 查询所有规格信息
export const FindAllProductSpec = () => {
  return request({
    url: `/admin/product/productSpec/findAllProductSpec`,
    method: 'get',
  })
}

// 删除所选商品规格
export const DeleteProductSpecById = id => {
  return request({
    url: `/admin/product/productSpec/deleteById/${id}`,
    method: 'delete',
  })
}
