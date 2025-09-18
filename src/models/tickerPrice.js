"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TickerPrice extends Model {
    static associate(models) {

    }
  }

  TickerPrice.init(
    {
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "TickerPrice",
      tableName: "ticker_prices",
      timestamps: true,
    }
  );

  return TickerPrice;
};
