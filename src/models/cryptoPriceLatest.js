'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CryptoPriceLatest extends Model {
    static associate(models) {
    }
  }

  CryptoPriceLatest.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CryptoPriceLatest',
    tableName: 'crypto_price_latest',
    timestamps: false,
  });

  return CryptoPriceLatest;
};
