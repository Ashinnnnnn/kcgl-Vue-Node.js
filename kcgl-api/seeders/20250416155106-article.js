//种子文件 以 js 文件的形式给数据表中添加模拟数据
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //这个里面添加模拟数据
    const articles = []
    const counts = 100

    for (let i = 1; i <= counts; i++) {
        articles.push({
          title: `文章的标题${i}`,
          content: `文章的内容${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    }
    //往Articles表插入articles数据
    await queryInterface.bulkInsert('Articles', articles, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    //往Articles表删除articles数据
    await queryInterface.bulkDelete('Articles', null, {})
  }
};
