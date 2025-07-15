const express = require('express')
const router = express.Router()
// 导入系统设置模型. 
// 细节：require整个目录, models/index.js会自动执行
const { Setting } = require('../../models')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')


/**
 * 1.封装方法
 * 公共方法: 查询指定id的系统设置
 */
async function getSetting(req) {
    const setting = await Setting.findOne()
    if (!setting) {
        throw new NotFoundError(`初始系统设置未找到，请运行种子文件。`)
    }
    return setting
}

/**
 * 查询系统设置详情
 * GET /admin/settings
*/
router.get('/', async (req, res) =>{
    try {
      const setting = await getSetting(req)

      success(res, '查询系统设置成功。', {setting})

    } catch (error) { 
        failure(res, error)
    }
})

/**
 * 更新指定id的系统设置
 * PUT /admin/settings
 */
router.put('/', async (req, res) => {
    try {
        const setting = await getSetting(req)
        const body = {
            name: req.body.name,
            icp: req.body.icp,
            copyright: req.body.copyright
        }
        await setting.update(body)

        success(res,"更新系统设置成功", {setting})
    } catch (error) {
        failure(res, error)
    }
})

module.exports = router