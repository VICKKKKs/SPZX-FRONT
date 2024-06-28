import request from '@/utils/request'

const api_name = '/admin/product/productUnit'

// 分页列表
export const GetPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
  })
}

// 分页列表
export const SaveProductUnit = productUnit => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: productUnit,
  })
}

// 修改信息
export const UpdateProductUnitById = productUnit => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: productUnit,
  })
}

// 删除数据
export const DeleteProductUnitById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

// 获取全部信息
export const FindAllProductUnit = () => {
  return request({
    url: `${api_name}/findAll`,
    method: 'get',
  })
}
