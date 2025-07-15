/**
* 请求成功
* @param res
* @param message
* @param data
* @param code
*/
function success(res, message, data = {}, code = 200) {
    //code是状态码: 200 表示成功，其他表示失败
    res.status(code).json({
      status: true,
      message,
      data
    });
  }

/**
 * 请求失败
 * @param res
 * @param error
 */
function failure(res, error) {
    // 校验类错误 模型入库之前校验错误，返回400状态码，返回错误信息数组
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({
        status: false,
        message: '请求参数错误',
        errors
      })
    }

    // 1.token 错误
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
          status: false,
          message: '认证失败',
          errors: ['您提交的 token 错误。']
      })
    }

    // 2.token 过期
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
          status: false,
          message: '认证失败',
          errors: ['您的 token 已过期。']
      })
    }
  
    // 未找到
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        status: false,
        message: '资源不存在',
        errors: [error.message]
      })
    }

    // 用自己代码验证时抛出的错误
    if (error.name === 'BadRequestError') {
      return res.status(400).json({
        status: false,
        message: '请求参数错误',
        errors: [error.message]
      });
    }

      // 认证失败
    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
          status: false,
          message: '认证失败',
          errors: [error.message]
      });
    }

    // 其它服务器错误
    res.status(500).json({
      status: false,
      message: '服务器错误',
      errors: [error.message]
    })
    
}
  
  module.exports = {
    success,
    failure
  }
  