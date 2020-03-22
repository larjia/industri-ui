import request from '@/utils/request'

// 查询工序不良原因列表
export function listReason (query) {
  return request({
    url: '/production/sf/oprejectreason/list',
    method: 'get',
    params: query
  })
}

// 新增不良原因
export function addReason (data) {
  return request({
    url: '/production/sf/oprejectreason',
    method: 'post',
    data: data
  })
}

// 修改不良原因
export function updateReason (data) {
  return request({
    url: '/production/sf/oprejectreason',
    method: 'put',
    data: data
  })
}

// 删除不良原因
export function deleteReason (id) {
  return request({
    url: '/production/sf/oprejectreason/' + id,
    method: 'delete'
  })
}
