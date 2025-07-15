'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    //分类名称，唯一。长度在1-50个字符之间
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名称不能为空.' },
        notEmpty: { msg: '名称不能为空.' },
        len: { args: [2, 45], msg: '名称长度必须在1-50个字符之间.' },
        async isUnique(value) {
          const category = await Category.findOne({ where: { name: value } })
          if (category) {
            throw new Error('名称已存在，请选择其他名称。');
          }
        }
      }
    },
    //排序字段，数字越小越靠前显示。默认值为100
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写' },
        notEmpty: { msg: '排序不能为空' },
        isInt: { msg: '排序必须为整数' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须为正整数')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category
};