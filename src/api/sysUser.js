import request from '@/utils/request'

export const GetSysUserListByPage = (pageNum, pageSize, queryDto) => {
  const response = request({
    url: `/admin/system/sysUser/findByPage/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryDto,
  })
  return response
}

export const SaveSysUser = sysUser => {
  const response = request({
    url: `/admin/system/sysUser/saveSysUser`,
    method: 'post',
    data: sysUser,
  })
  return response
}

export const UpdateSysUser = sysUser => {
  const response = request({
    url: `/admin/system/sysUser/updateSysUser`,
    method: 'put',
    data: sysUser,
  })
  return response
}

export const DeleteSysUserById = userId => {
  return request({
    url: '/admin/system/sysUser/deleteById/' + userId,
    method: 'delete',
  })
}
