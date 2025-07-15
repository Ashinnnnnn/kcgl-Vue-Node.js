import request from '@/utils/request'

export const getUserSexCount = () => {
  return request({
    method: 'get',
    url: '/admin/charts/sex',
  })
}

export const getUserRegisterMonthCount = () => {
  return request({
    method: 'get',
    url: '/admin/charts/user',
  })
}
