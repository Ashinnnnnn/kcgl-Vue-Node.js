const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res) {
    try {

        const male = await User.count({ where: { sex: 0 } })
        const female = await User.count({ where: { sex: 1 } })
        const unknown = await User.count({ where: { sex: 2 } })

        const data = [
            { value: male, name: '男性' },
            { value: female, name: '女性' },
            { value: unknown, name: '未选择' }
        ]

        success(res, '查询用户性别成功。', { data });

    } catch (error) {
        failure(res, error);
    }
})

/**
 * 统计每个月用户数量
 * GET /admin/charts/user
 */
router.get('/user', async (req, res) => {
    try {
        // 执行原生的 SQL 查询语句
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");

        // 准备数据存储的结构
        const data = {
            months: [],
            values: [],
        };

        // 填充数据
        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '查询每月用户数量成功。', { data });

    } catch (error) {
        failure(res, error);
    }
})


module.exports = router
