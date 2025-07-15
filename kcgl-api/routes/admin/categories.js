const express = require('express')
const router = express.Router()
const { Category, Course } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')


/**
 * 公共方法: 查询指定id的分类
 */
async function getCategory(req) {
    const { id } = req.params
    const category = await Category.findByPk(id)
    if (!category) {
        throw new NotFoundError(`ID: ${id}的分类未找到。`)
    }
    return category
}

/**
 * 2.封装方法
 * 公共方法: 过滤表单提交的数据
 */
function filterBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    }
}

/**
 * 查询分类列表
 * GET /admin/categories
 */
router.get('/', async (req, res) => {
    try {
        // 定义查询条件
        const condition = {
            order: [['rank', 'ASC'], ['id', 'ASC']],
        }
        // 处理查询参数
        const query = req.query
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
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
        // 4.查询分类列表数据
        const { count, rows } = await Category.findAndCountAll(condition)
        // 5.修改响应内容
        success(res, '查询分类列表数据成功', {
            categories: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })

    } catch (error) {
        // 响应错误信息
        failure(res, error)
    }
})

/**
 * 查看指定id的分类详情
 * GET /admin/categories/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await getCategory(req)
        // 只写成功-响应.  因为查询失败会抛错误, 所以不用判断是否存在
        success(res, '查询分类详情数据成功', {category})
    } catch (error) {
        // 响应错误信息
        failure(res, error)
    }
})


/**
 * 创建分类
 * POST /admin/categories
 */
router.post('/', async (req, res) => {
    try {
        // 获取请求参数
        const body = filterBody(req)
        // 创建分类
        const category = await Category.create(body)
        // 成功-响应数据  201表示创建成功
        success(res, '创建分类成功', {category}, 201)

    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除指定id的分类
 * DELETE /admin/categories/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const category = await getCategory(req)

        // 如果当前分类是否有课程,则不能删除
        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }

        // 只写成功-响应.  因为查询失败会抛错误, 所以不用判断是否存在
        await category.destroy()
        success(res, '删除分类成功')
       
    } catch (error) {
        // 6.失败-响应错误信息
        failure(res, error)
    }
})

/**
 * 更新指定id的分类
 * PUT /admin/categories/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const category = await getCategory(req)
        // 只写成功-响应.  因为查询失败会抛错误, 所以不用判断是否存在
        const body = filterBody(req)
        await category.update(body)
        success(res, '更新分类成功', {category})
      
    } catch (error) {
        // 6.失败-响应错误信息
        failure(res, error)
    }
})

module.exports = router