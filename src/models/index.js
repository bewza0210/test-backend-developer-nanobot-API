const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const TickerPrice = require('./tickerPrice')(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  TickerPrice
};

Object.values(db).forEach((model) => {
  if (model?.associate) {
    model.associate(db);
  }
});

module.exports = db;
