'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('crypto_price_history', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      symbol: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      open_price: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
      },
      high_price: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
      },
      low_price: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
      },
      close_price: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
      },
      volume: {
        type: Sequelize.DECIMAL(30, 10),
        allowNull: true,
      },
      interval_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('crypto_price_history');
  }
};
