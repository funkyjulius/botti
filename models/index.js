const env = require('dotenv').config().parsed;
const Sequelize = require('sequelize');
const requireModels = require('sequelize-require-models');

const DATABASE_URL = process.env.DATABASE_URL || env.DATABASE_URL;

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
