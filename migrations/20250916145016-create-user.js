'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      lastLoginAt: { type: Sequelize.DATE },

      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('NOW()') 
      },
      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('NOW()') 
      },
      deletedAt: { type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
