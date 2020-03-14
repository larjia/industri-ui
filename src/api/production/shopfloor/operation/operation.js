import request from '@/utils/request'

// 查询工序列表
export function listOperations (query) {
  return request({
    url: '/production/shopfloor/operation/list',
    method: 'get',
    params: query
  })
}

// 查询工序详细
export function getOperation (opId) {
  return request({
    url: '/production/shopfloor/operation/' + opId,
    method: 'get'
  })
}

// 新增工序
export function addOperation (data) {
  return request({
    url: '/production/shopfloor/operation',
    method: 'post',
    data: data
  })
}

// 修改工序
export function updateOperation (data) {
  return request({
    url: '/production/shopfloor/operation',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delOperation (opId) {
  return request({
    url: '/production/shopfloor/operation/' + opId,
    method: 'delete'
  })
}
