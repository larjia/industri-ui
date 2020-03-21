import request from '@/utils/request'

export function listPart (query) {
  return request({
    url: '/masterdata/part/list',
    method: 'get',
    params: query
  })
}

export function getPartById (id) {
  return request({
    url: '/masterdata/part/id/' + id,
    method: 'get'
  })
}

export function getPartByNumber (number) {
  return request({
    url: '/masterdata/part/number/' + number,
    method: 'get'
  })
}

export function addPart (data) {
  return request({
    url: '/masterdata/part',
    method: 'post',
    data: data
  })
}

export function updatePart (data) {
  return request({
    url: '/masterdata/part',
    method: 'put',
    data: data
  })
}

export function deletePartById (id) {
  return request({
    url: '/masterdata/part/' + id,
    method: 'delete'
  })
}
