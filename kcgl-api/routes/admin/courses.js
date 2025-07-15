const express = require('express')
const router = express.Router()
// 导入课程模型.  细节：require整个目录, models/index.js会自动执行
const { Course, Category, User } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')

/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ]
  }
}

/**
 * 1.封装方法
 * 公共方法: 查询指定id的课程
 */
async function getCourse(req) {
  const { id } = req.params

  const condition = getCondition()

  // 添加条件参数
  const course = await Course.findByPk(id, condition)
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到。`)
  }
  return course
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    // userId: req.body.userId,
    // 直接从当前用户信息中获取用户id
    userId: req.user.id,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  }
}


/**
 * 查询课程列表
 * GET /admin/courses
 */
router.get('/', async (req, res) => {

  try {

    // 1.查询条件
    const condition = {
      order: [['id', 'DESC']],
      ...getCondition()
    }
    // 处理查询参数
    const query = req.query
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      }
    }

    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      }
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      }
    }

    if (query.recommended) {
      condition.where = {
        recommended: {
          // queryString中传过来的推荐值是字符串, 通过 === 'true' 转换为布尔值
          [Op.eq]: query.recommended === 'true'
        }
      }
    }

    if (query.introductory) {
      condition.where = {
        introductory: {
          // queryString中传过来的推荐值是字符串, 通过 === 'true' 转换为布尔值
          [Op.eq]: query.introductory === 'true'
        }
      }
    }

    // 1.获取当前页码. 若没有传currentPage参数,则默认为1
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    // 2.获取每页条数. 若没有传pageSize参数,则默认为10
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    // 3.追加分页条件
    condition.limit = pageSize  // 这里的limit就是页大小,与SQL中的limit不同
    condition.offset = (currentPage - 1) * pageSize // 要跳转的记录数

    const { count, rows } = await Course.findAndCountAll(condition)

    // 3.成功-响应数据
    success(res, '查询课程列表成功', {
      courses: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })

  } catch (error) {
    // 4.失败-响应错误信息
    failure(res, error)

  }

})

/**
 * 查询课程详情
 * GET /admin/courses/:id
*/
router.get('/:id', async (req, res) => {
  try {
    const course = await getCourse(req)
    success(res, '查询课程成功。', course)

  } catch (error) {  // 其他错误
    // 4.其它错误-响应
    failure(res, error)
  }
})

/**
* 创建课程
* POST /admin/courses
*/
router.post('/', async (req, res) => {
  try {
    // 1.获取请求参数
    const body = filterBody(req)
    // 2.创建课程
    const course = await Course.create(body)
    // 3.成功-响应数据  201表示创建成功
    success(res, '创建课程成功', course)

  } catch (error) {
    // 1.判断错误类型
    failure(res, error)
  }
})

/**
 * 删除指定id的课程
 * DELETE /admin/courses/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const course = await getCourse(req)
    await course.destroy()
    success(res, '删除课程成功')

  } catch (error) {
    // 6.失败-响应错误信息
    failure(res, error)

  }
})

/**
 * 更新指定id的课程
 * PUT /admin/courses/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const course = await getCourse(req)
    const body = filterBody(req)
    await course.update(body)
    success(res, '更新课程成功', course)

  } catch (error) {
    // 6.失败-响应错误信息
    failure(res, error)
  }
})

module.exports = router