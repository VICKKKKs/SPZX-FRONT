import request from '@/utils/request'

export const GetSysRoleListByPage = (pageNum, pageSize, queryDto) => {
  const response = request({
    // /admin/system/sysRole/findByPage/{pageNum}/{pageSize}
    url: `/admin/system/sysRole/findByPage/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryDto,
  })
  return response
}

export const SaveSysRole = sysRole => {
  const response = request({
    url: `/admin/system/sysRole/saveSysRole`,
    method: 'post',
    data: sysRole,
  })
  return response
}

export const UpdateSysRole = sysRole => {
  const response = request({
    url: `/admin/system/sysRole/updateSysRole`,
    method: 'put',
    data: sysRole,
  })
  return response
}

// 查询所有的角色数据
export const GetAllRoleList = userId => {
  return request({
    url: '/admin/system/sysUserRole/getUserRoleIdList/' + userId,
    method: 'get',
  })
}

// 给用户分配角色请求
export const DoAssignRoleToUser = assginRoleVo => {
  return request({
    url: '/admin/system/sysUserRole/doAssign',
    method: 'post',
    data: assginRoleVo,
  })
}

// 删除角色请求
/* export const DeleteSysRole = (roleId) => {
    return request({
        url: `/admin/system/sysRole/deletdeById/${roleId}`,
        method: 'delete'
    })
} */
export const DeleteSysRoleById = roleId => {
  return request({
    url: '/admin/system/sysRole/deleteById/' + roleId,
    method: 'delete',
  })
}
