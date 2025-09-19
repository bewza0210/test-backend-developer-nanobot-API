'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CryptoPriceHistory extends Model {
    static associate(models) {
    }
  }

  CryptoPriceHistory.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    open_price: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    high_price: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    low_price: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    close_price: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    volume: {
      type: DataTypes.DECIMAL(30, 10),
      allowNull: true,
    },
    interval_sec: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CryptoPriceHistory',
    tableName: 'crypto_price_history',
    timestamps: false,
  });

  return CryptoPriceHistory;
};
