import request from '@/utils/request'

//获取课程列表
export const getCategories = (condition) => {
  return request({
    method: 'GET',
    url: '/admin/categories',
    params: condition,
  })
}

//创建分类
export const createCategories = (data) => {
  return request({
    method: 'POST',
    url: '/admin/Categories',
    data,
  })
}

//根据id获取分类信息
export const getCategoriesById = (id) => {
  return request({
    method: 'GET',
    url: `/admin/Categories/${id}`,
  })
}

//更新分类信息
export const updateCategory = (id, newCategoryInfo) => {
  return request({
    method: 'PUT',
    url: `/admin/Categories/${id}`,
    data: newCategoryInfo,
  })
}

//删除课程
export const deleteCategory = (id) => {
  return request({
    method: 'DELETE',
    url: `/admin/Categories/${id}`,
  })
}
