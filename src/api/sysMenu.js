import request from '@/utils/request'

export const FindNodes = parentId => {
  const response = request({
    // /admin/system/sysMenu/FindNodes/{parentId}
    url: `/admin/system/sysMenu/findNodes/${parentId}`,
    method: 'get',
  })
  return response
}

export const SaveSysMenu = sysMenu => {
  const response = request({
    url: `/admin/system/sysMenu/saveSysMenu`,
    method: 'post',
    data: sysMenu,
  })
  return response
}

export const UpdateSysMenu = sysMenu => {
  const response = request({
    url: `/admin/system/sysMenu/updateSysMenu`,
    method: 'put',
    data: sysMenu,
  })
  return response
}
