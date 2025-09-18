'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

    }
  }

  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLoginAt: { type: DataTypes.DATE },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,     
    paranoid: true,       
    deletedAt: 'deletedAt'
  });

  return User;
};
