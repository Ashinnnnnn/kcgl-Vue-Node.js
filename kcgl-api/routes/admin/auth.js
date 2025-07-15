const express = require('express')
const router = express.Router()
const { User } = require('../../models')
const { Op } = require('sequelize')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
    try {
        // 1.解构请求参数
        const { login, password } = req.body;

        // 2.未提供必要的登录信息, 则抛出错误
        if (!login) {
            throw new BadRequestError('邮箱/用户名必须填写。');
        }

        if (!password) {
            throw new BadRequestError('密码必须填写。');
        }

        // 3.形成查询条件( 或者email 或者username )
        const condition = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        };

        // 4.通过email或username，查询用户是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用户不存在，无法登录。');
        }

        // 5.校验密码是否正确. password为用户输入的密码, user.password为数据库中存储的密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误。');
        }

        // 6.验证是否管理员. 后台只有管理员才能登录
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限登录管理员后台。');
        }

        // 7.生成身份验证令牌. (携带的数据, 密钥, 有效期)
        const token = jwt.sign(
            {userId: user.id}, 
            process.env.SECRET_KEY, 
            { expiresIn: '30d' }
        )

        // 8.将token响应给客户端
        success(res, '登录成功。', { token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.password,
                nickname: user.nickname,
                sex: user.sex,
                company: user.company,
                introduce: user.introduce,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })


    } catch (error) {
        failure(res, error)
    }
});

module.exports = router
