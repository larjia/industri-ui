import request from '@/utils/request'

// 查询工序列表
export function listOperation (query) {
  return request({
    url: '/production/sf/operation/list',
    method: 'get',
    params: query
  })
}

// 查询工序详细
export function getOperation (id) {
  return request({
    url: '/production/sf/operation/' + id,
    method: 'get'
  })
}

// 新增工序
export function addOperation (data) {
  return request({
    url: '/production/sf/operation',
    method: 'post',
    data: data
  })
}

// 修改工序
export function updateOperation (data) {
  return request({
    url: '/production/sf/operation',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delOperation (opId) {
  return request({
    url: '/production/sf/operation/' + opId,
    method: 'delete'
  })
}
