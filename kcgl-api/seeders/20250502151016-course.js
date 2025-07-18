'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        name: 'CSS 入门',
        recommended: true,
        introductory: true,
        likesCount: 0,
        chaptersCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'Node.js 项目实践（2025 版）',
        recommended: true,
        introductory: false,
        likesCount: 0,
        chaptersCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {})
  }
}
