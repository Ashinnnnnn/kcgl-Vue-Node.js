import request from '@/utils/request'

//登录请求
export const login = (loginInfo) => {
  return request({
    method: 'POST',
    // http://locahost:3000/admin/auth/sign_in
    // /api/admin/auth/sign_in
    url: '/admin/auth/sign_in',
    data: loginInfo,
  })
}
/*
	接口文档中:
 		请求类型为  application/x-www-form-urlencoded
 							 参数需要以 属性1=值1&属性2=值2&属性3=值3 的字符串形式传输, 不能有任何空格
               例如
               data:`username=${loginInfo.username}&password=${loginInfo.password}`

    请求类型为  application/json
               参数可以直接传递一个JS对象,  axios 会自动将JS对象转为JSON字符串传输
               例如
               data: loginInfo
*/
