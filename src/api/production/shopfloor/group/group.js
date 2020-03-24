import request from '@/utils/request'

// 查询班组列表
export function listGroup (query) {
  return request({
    url: '/production/sf/group/list',
    method: 'get',
    params: query
  })
}

// 根据车间Id查询班组
export function getGroupByDeptId (deptId) {
  return request({
    url: '/production/sf/group/getgroupbydeptid/' + deptId,
    method: 'get'
  })
}

// 查询班组详细
export function getGroup (groupId) {
  return request({
    url: '/production/sf/group/' + groupId,
    method: 'get'
  })
}

// 新增班组
export function addGroup (data) {
  return request({
    url: '/production/sf/group',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateGroup (data) {
  return request({
    url: '/production/sf/group',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delGroup (groupId) {
  return request({
    url: '/production/sf/group/' + groupId,
    method: 'delete'
  })
}
