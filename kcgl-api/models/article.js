'use strict';

// 用于对数据表的增删改查操作
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    //表单验证
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '标题必须存在'},
        notEmpty: { msg: '标题不能为空'},
        len: { args: [2, 45], msg: '标题长度必须在2-45个字符之间'}
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: '内容必须存在'},
        notEmpty: { msg: '内容不能为空'},
        len: { args: [10, 10000], msg: '内容长度必须在10-10000个字符之间'}
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};