import request from '@/utils/request'

//获取用户列表
export const getUsers = (condition) => {
  return request({
    method: 'GET',
    url: '/admin/users',
    params: condition,
  })
}
//创建用户
export const createUser = (data) => {
  return request({
    method: 'POST',
    url: '/admin/users',
    data,
  })
}
//根据id获取用户信息
export const getUsersById = (id) => {
  return request({
    method: 'GET',
    url: `/admin/users/${id}`,
  })
}
//更新用户信息
export const updateUser = (id, newUserInfo) => {
  return request({
    method: 'PUT',
    url: `/admin/users/${id}`,
    data: newUserInfo,
  })
}
//删除用户
export const deleteUser = (id) => {
  return request({
    method: 'DELETE',
    url: `/admin/users/${id}`,
  })
}
