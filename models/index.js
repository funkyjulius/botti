const { DATABASE_URL } = require('dotenv').config().parsed;
const Sequelize = require('sequelize');
const requireModels = require('sequelize-require-models');

const db = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  ssl: true,
  sync: true,
  logging: false,
  dialectOptions: {
    ssl: true,
  },
});

const models = requireModels(db, __dirname);

module.exports = Object.assign({ db }, models);
