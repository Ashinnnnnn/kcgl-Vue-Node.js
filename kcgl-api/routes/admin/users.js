const express = require('express')
const router = express.Router()
// 导入用户模型. 
// 细节：require整个目录, models/index.js会自动执行
const { User } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')
const { formidable } = require('formidable')



async function getUser(req) {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
        throw new NotFoundError(`ID: ${id}的用户未找到。`)
    }
    return user
}

function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
      };
}

/**
 * 查询用户列表
 */
//分页 /admin/users?currentPage=1&pageSize=10
//模糊查询 /admin/users?title=7
//'/'这个代指/admin/users 如果是'/xxx'则表示/admin/users/xxx
router.get('/',  async (req, res) => {

    try {
        
        // 1.查询条件
        const condition = {
            order: [['id', 'DESC']]
        }
        // 处理查询参数（模糊查询）
        const query = req.query

        // 查询-邮箱
        if (query.email) {
            condition.where = {
                email: {
                    [Op.eq]: query.email
                }
            };
        }
        // 查询-用户名
        if (query.username) {
            condition.where = {
                username: {
                    [Op.eq]: query.username
                }
            };
        }
        // 查询-昵称
        if (query.nickname) {
            condition.where = {
                nickname: {
                    [Op.like]: `%${query.nickname}%`
                }
            };
        }
        // 查询-角色
        if (query.role) {
            condition.where = {
                role: {
                    [Op.eq]: query.role
                }
            };
        }
        
        // 1.获取当前页码. 若没有传currentPage参数,则默认为1
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        // 2.获取每页条数. 若没有传pageSize参数,则默认为10
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        // 3.追加分页条件
        condition.limit = pageSize  
        // 这里的limit就是页大小,与SQL中的limit不同
        condition.offset = (currentPage - 1) * pageSize 
        // 要跳转的记录数
        const { count, rows } = await User.findAndCountAll(condition)

        //用success函数替换掉响应内容，success(res, message, data)
        success(res, '查询用户列表数据成功', {
            users: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })

    } catch (error) {
        failure(res, error)
    }

})

/**
 * 查询用户详情
 * GET /admin/users/:id
*/
router.get('/:id', async (req, res) =>{
    try {

    //   改用getUser方法
      const user = await getUser(req)

      success(res, '查询用户成功。', {user})

    } catch (error) {  // 其他错误
        failure(res, error)
    }
})
  
/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async (req, res) => {
    try {
        // 1.获取请求参数
        const body = filterBody(req)
        // 2.创建用户
        const user = await User.create(body)

        success(res, '创建用户成功', {user}, 201)

    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除指定id的用户
 * DELETE /admin/users/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const user = await getUser(req)

        await user.destroy()

        success(res,'删除用户成功')

    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新指定id的用户
 * PUT /admin/users/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const user = await getUser(req)
        const body = filterBody(req)
        await user.update(body)

        success(res,"更新用户成功", {user})

    } catch (error) {
        failure(res, error)
    }
})

// 处理上传的图片
router.post('/uploadAvatar', (req, res) => {
    // 填写配置项, 实例化 formidable 对象
    const form = formidable({
        multiples: true,
        uploadDir: __dirname + '../../../public/images/avatar',  // 目录不存在会失败
        keepExtensions: true,
    })

    // 使用 form 对象解析上传数据
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.json({
                status: false,
                message: '上传失败',
                errors: [err.message]
            })
        }
        // 查看表单其它字段数据
        console.log('fields', fields)
        // 查看上传的文件数据
        console.log('files', files.avatar)

        // 拼接以后访问该文件的路径. (正式项目中会把该地址保存到数据库)
        let url = '/images/avatar/' + files.avatar[0].newFilename
        res.json({
            status: true,
            message: '上传成功',
            data: { url }
        })
    })

})

module.exports = router