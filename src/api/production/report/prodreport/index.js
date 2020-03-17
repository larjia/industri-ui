import request from '@/utils/request'

// 生产报工列表
export function listReportHist (query) {
  return request({
    url: '/production/prodreporthist/list',
    method: 'get',
    params: query
  })
}
