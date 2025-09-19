'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('secret123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test User',
        username: 'testuser',
        email: 'testuser@example.com',
        password: passwordHash,
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
