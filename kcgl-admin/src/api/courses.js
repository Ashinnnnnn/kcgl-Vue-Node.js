import request from '@/utils/request'

//获取课程列表
export const getCourses = (condition) => {
  return request({
    method: 'GET',
    url: '/admin/courses',
    params: condition,
  })
}

//创建课程
export const createCourse = (data) => {
  return request({
    method: 'POST',
    url: '/admin/courses',
    data,
  })
}

//根据id获取课程信息
export const getCoursesById = (id) => {
  return request({
    method: 'GET',
    url: `/admin/courses/${id}`,
  })
}

//更新课程信息
export const updateCourse = (id, newCourseInfo) => {
  return request({
    method: 'PUT',
    url: `/admin/courses/${id}`,
    data: newCourseInfo,
  })
}

//删除课程
export const deleteCourse = (id) => {
  return request({
    method: 'DELETE',
    url: `/admin/courses/${id}`,
  })
}
