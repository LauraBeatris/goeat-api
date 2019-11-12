"use strict";const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

module.exports = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
