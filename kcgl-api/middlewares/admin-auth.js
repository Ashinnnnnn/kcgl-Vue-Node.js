const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { UnauthorizedError } = require('../utils/errors')
const { success, failure } = require('../utils/responses')

module.exports = async (req, res, next) => {
    try {
        // 1.尝试获取token
        // 2.实际请求时传 Authorization , 此处接收用小写 authorization
        // 3.接收后, 起别名为 token
        const { authorization: token } = req.headers
        if (!token) {
            throw new UnauthorizedError('当前接口需要认证才能访问。')
        }

        // 2.验证token. 如果验证失败，会抛出异常(错误、过期)
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        // 3.根据解构的userId查询用户
        const user = await User.findByPk(decoded.userId)
        if (!user) {
            throw new UnauthorizedError('用户不存在。')
        }

        // 4.验证当前用户是否是管理员
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限使用当前接口。')
        }

        // 5.如果通过验证，将 user 对象挂载到 req 上，方便后续中间件或路由使用
        req.user = user

        // 一定要加 next()，才能继续进入到后续中间件或路由
        next()


    } catch (error) {
        failure(res, error)
    }
}
