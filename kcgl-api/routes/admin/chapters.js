const express = require('express')
const router = express.Router()
// 导入章节模型.  细节：require整个目录, models/index.js会自动执行
const { Chapter, Course } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')


/**
 * 公共方法：关联查询条件-课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: { exclude: ['CourseId'] },
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'name']
            }
        ]
    }
}

/**
 * 1.封装方法
 * 公共方法: 查询指定id的章节
 */
async function getChapter(req) {
    const { id } = req.params
    const condition = getCondition()
    const chapter = await Chapter.findByPk(id, condition)
    if (!chapter) {
        throw new NotFoundError(`ID: ${id}的章节未找到。`)
    }
    return chapter
}

/**
 * 公共方法：表单过滤, 只保留需要的字段
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
    return {
      courseId: req.body.courseId,
      title: req.body.title,
      content: req.body.content,
      video: req.body.video,
      rank: req.body.rank
    };
  }

/**
 * 查询章节列表
 * GET /admin/chapters
 */
router.get('/', async (req, res) => {

    try {
        // 处理查询参数
        const query = req.query

        // 必然是查询某个课程ID下的所有章节，所以课程id必须要有
        if (!query.courseId) {
            throw new Error('获取章节列表失败，课程ID不能为空。');
        }

        // 1.查询条件
        const condition = {
            ...getCondition(),
            order: [['rank', 'ASC'], ['id', 'ASC']],
        }

        condition.where = {
            courseId: {
                [Op.eq]: query.courseId
            }
        }

        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
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

        const { count, rows } = await Chapter.findAndCountAll(condition)

        // 3.成功-响应数据
        success(res, '查询章节列表成功', {
            chapters: rows,
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
 * 查询章节详情
 * GET /admin/chapters/:id
*/
router.get('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)
        success(res, '查询章节成功。', chapter)

    } catch (error) {  // 其他错误
        // 4.其它错误-响应
        failure(res, error)
    }
})

/**
* 创建章节
* POST /admin/chapters
*/
router.post('/', async (req, res) => {
    try {
        // 1.获取请求参数
        const body = filterBody(req)
        // 2.创建章节
        const chapter = await Chapter.create(body)
        // 3.成功-响应数据  201表示创建成功
        success(res, '创建章节成功', chapter)
        
    } catch (error) {
        // 1.判断错误类型
        failure(res, error)
    }
})

/**
 * 删除指定id的章节
 * DELETE /admin/chapters/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)
        // 如果课程有章节，则不能删除
        const count = await Chapter.count({ where: { courseId: req.params.id } })
        if (count > 0) {
        throw new Error('当前课程有章节，无法删除。')
        }

        await chapter.destroy()
        success(res, '删除章节成功')
         
    } catch (error) {
        // 6.失败-响应错误信息
        failure(res, error)
        
    }
})

/**
 * 更新指定id的章节
 * PUT /admin/chapters/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const chapter = await getChapter(req)
        const body = filterBody(req)
        await chapter.update(body)
        success(res, '更新章节成功', chapter)
        
    } catch (error) {
        // 6.失败-响应错误信息
        failure(res, error)
    }
})

module.exports = router