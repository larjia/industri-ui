import request from '@/utils/request'

// 查询质量PPM列表
export function listPPM (query) {
  return request({
    url: '/production/quality/ppm/list',
    method: 'get',
    params: query
  })
}
