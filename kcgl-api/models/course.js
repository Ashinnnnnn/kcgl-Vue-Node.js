'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 课程属于某个分类, 给分类模型设置一个别名
      models.Course.belongsTo(models.Category, {as: 'category'})
      // 课程属于某个用户, 给用户模型设置一个别名
      models.Course.belongsTo(models.User, {as: 'user'})
      // 一个课程, 有多个章节
      models.Course.hasMany(models.Chapter, { as: 'chapters' });
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类ID必须填写。' },
        notEmpty: { msg: '分类ID不能为空。' },
        // 自定义: 用户添加的值是否存在数据表中
        async isPresent(value) {
          // 访问其它模型时的语法：sequelize.models.Xxxxx
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value} 的分类不存在。`);
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户ID必须填写。' },
        notEmpty: { msg: '用户ID不能为空。' },
        // 自定义: 用户添加的值是否存在数据表中
        async isPresent(value) {
          // 访问其它模型时的语法：sequelize.models.Xxxxx
          const user = await sequelize.models.User.findByPk(value)
          if (!user) {
            throw new Error(`ID为：${value} 的用户不存在。`);
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        len: { args: [2, 45], msg: '名称长度必须是2 ~ 45之间。' }
      }
    },
    image: {
      type: DataTypes.STRING,
      // validate: {
      //   isUrl: { msg: '图片地址不正确。' }
      // }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: { args: [[true, false]], msg: '是否推荐的值必须是，推荐：true 不推荐：false。' }
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: { args: [[true, false]], msg: '是否入门课程的值必须是，推荐：true 不推荐：false。' }
      }
    },
    content: DataTypes.TEXT,
    likesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    chaptersCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }    
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};