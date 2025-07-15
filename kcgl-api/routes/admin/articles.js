const express = require('express')
const router = express.Router()
// 导入文章模型. 
// 细节：require整个目录, models/index.js会自动执行
const { Article } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')


/**
 * 1.封装方法
 * 公共方法: 查询指定id的文章
 */
async function getArticle(req) {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if (!article) {
        throw new NotFoundError(`ID: ${id}的文章未找到。`)
    }
    return article
}

/**
 * 2.封装方法
 * 公共方法: 过滤表单提交的数据
 */
function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

/**
 * 查询文章列表
 * GET /admin/articles
 */
//分页 /admin/articles?currentPage=1&pageSize=10
//模糊查询 /admin/articles?title=7
//'/'这个代指/admin/articles 如果是'/xxx'则表示/admin/articles/xxx
router.get('/',  async (req, res) => {

    try {
        
        // 1.查询条件
        const condition = {
            order: [['id', 'DESC']] //按id降序排
            // 在id相同的时候按名字 升序排
            // order: [['id', 'DESC'],['name', 'ASC']]
            // order: [['name', 'ASC']] //按name升序排
        }
        // 处理查询参数（模糊查询）
        const query = req.query
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                } 
            }
        }
        //可以在网页上直接输入/admin/articles?currentPage=1&pageSize=5
        //currentPage为页码 pageSize为每页条数

        
        // 1.获取当前页码. 若没有传currentPage参数,则默认为1
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        // 2.获取每页条数. 若没有传pageSize参数,则默认为10
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        // 3.追加分页条件
        condition.limit = pageSize  
        // 这里的limit就是页大小,与SQL中的limit不同
        condition.offset = (currentPage - 1) * pageSize 
        // 要跳转的记录数

        // 根据查询条件查询文章列表
        /*
            4.将 findAll 方法改为 findAndCountAll 方法
              返回结果中 
                count 是查询到的数据的总数
                rows 中才是查询到的数据
        */
        // // 2.查询数据
        // const articles = await Article.findAll(condition)

        // // 3.成功-响应数据
        // res.json({
        //     status: true,
        //     message: '查询文章列表成功',
        //     data: articles
        // })

        const { count, rows } = await Article.findAndCountAll(condition)
        // 5.修改响应内容
        // res.json({
        //     status: true,
        //     message: '查询文章列表数据成功',
        //     data: {
        //         articles: rows,
        //         pagination: {
        //             total: count,
        //             currentPage,
        //             pageSize
        //         }
        //     }
        // })

        //用success函数替换掉响应内容，success(res, message, data)
        success(res, '查询文章列表数据成功', {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })

    } catch (error) {
        // // 4.失败-响应错误信息
        // res.status(500).json({
        //     status: false,
        //     message: '查询文章列表失败',
        //     errors: [error.message]
        // })

        failure(res, error)

        
    }

})

/**
 * 查询文章详情
 * GET /admin/articles/:id
*/
router.get('/:id', async (req, res) =>{
    try {

    //   改用getArticle方法
      const article = await getArticle(req)
    //   只写成功-响应.  因为查询失败会抛错误, 所以不用判断是否存在
    //   res.json({
    //     status: true,
    //     message: '查询文章成功。',
    //     data: article
    //   })

    success(res, '查询文章成功。', {article})

    //   // 1.获取文章 ID
    //   const { id } = req.params
  
    //   // 2.查询文章
    //   const article = await Article.findByPk(id)

    //   // 3.判断查询结果-作不同的响应
    //   if (article) {  
    //     // 文章存在
    //     res.json({
    //       status: true,
    //       message: '查询文章成功。',
    //       data: article
    //     })

    //   } else {   
    //     // 文章不存在
    //     res.status(404).json({
    //       status: false,
    //       message: '文章未找到。',
    //     })

    //   }

    } catch (error) {  // 其他错误
    //   // 4.其它错误-响应
    //   res.status(500).json({
    //     status: false,
    //     message: '查询文章失败。',
    //     errors: [error.message]
    //   })

        failure(res, error)
    }
})
  
/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async (req, res) => {
    try {
        // 1.获取请求参数
        // const body = {
        //     title: req.body.title,
        //     content: req.body.content
        // }
        // 1.获取请求参数
        const body = filterBody(req)
        // 2.创建文章
        const article = await Article.create(body)
        // 3.成功-响应数据  201表示创建成功
        // res.status(201).json({
        //     status: true,
        //     message: '创建文章成功',
        //     data: article
        // })

        success(res, '创建文章成功', {article}, 201)

    } catch (error) {
        // // 1.判断错误类型
        // if (error.name === 'SequelizeValidationError') {
        //     // 2.有可能不符合多条规则,所以报错信息会是一个数组.
        //     // 遍历拿到每条错误信息
        //     const errors = error.errors.map(err => err.message)
        //     // 3.响应错误信息
        //     res.status(400).json({
        //         status: false,
        //         message: '创建文章失败',
        //         errors
        //     })

        // } else {
        //     // 失败-响应错误信息
        //     res.status(500).json({
        //         status: false,
        //         message: '创建文章失败',
        //         errors: [error.message]
        //     })
        // }

        failure(res, error)

    }
})

/**
 * 删除指定id的文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const article = await getArticle(req)

        await article.destroy()
        // res.json({
        //     status: true,
        //     message: '删除文章成功',
        // })

        success(res,'删除文章成功')

        // // 1.获取文章id
        // const { id } = req.params
        // // 2.尝试获取文章,判断是否存在相应id的文件
        // const article = await Article.findByPk(id)
        // if (article) {
        //     // 3.存在-删除文章
        //     await article.destroy()
        //     // 4.成功-响应数据
        //     res.json({
        //         status: true,
        //         message: '删除文章成功',
        //     })
        // } else {
        //     // 5.不存在-响应信息
        //     res.status(404).json({
        //         status: false,
        //         message: '删除文章失败，文章不存在',
        //     })
        // }
    } catch (error) {
        // // 6.失败-响应错误信息
        // res.status(500).json({
        //     status: false,
        //     message: '删除文章失败',
        //     error: [error.message]
        // })

        failure(res, error)
    }
})

/**
 * 更新指定id的文章
 * PUT /admin/articles/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const article = await getArticle(req)
        // const body = {
        //     title: req.body.title,
        //     content: req.body.content
        // }
        const body = filterBody(req)
        await article.update(body)
        // res.json({
        //     status: true,
        //     message: '更新文章成功',
        //     data: article
        // })

        success(res,"更新文章成功", {article})

        // // 1.获取请求参数
        // const { id } = req.params
        // // 2.尝试获取文章,判断是否存在相应id的文件
        // const article = await Article.findByPk(id)
        // if (article) {
        //     // 3.存在-更新文章
        //     const body = {
        //         title: req.body.title,
        //         content: req.body.content
        //     }
        //     await article.update(body)
        //     // 4.成功-响应数据
        //     res.json({
        //         status: true,
        //         message: '更新文章成功',
        //         data: article
        //     })
        // } else {
        //     // 5.不存在-响应信息
        //     res.status(404).json({
        //         status: false,
        //         message:'更新文章失败，文章不存在',
        //     })
        // }
    } catch (error) {
        // // 6.失败-响应错误信息
        // res.status(500).json({
        //     status: false,
        //     message: '更新文章失败',
        //     error: [error.message]
        // })
        failure(res, error)
    }
})

module.exports = router