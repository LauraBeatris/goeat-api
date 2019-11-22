const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../app/models/User');
const Restaurant = require('../app/models/Restaurant');
const Provider = require('../app/models/Provider');
const File = require('../app/models/File');
const Order = require('../app/models/Order');
const Foods = require('../app/models/Food');
const Delivery = require('../app/models/Delivery');
const databaseConfig = require('../config/database');

dotenv.config({});

const models = [User, Restaurant, Provider, File, Order, Foods, Delivery];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // Connecting to the SQL database (MySQL)
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));

    const associatedModels = models.filter(
      model => typeof model.associate === 'function'
    );

    associatedModels.map(model => model.associate(this.connection.models));
  }

  // Connecting to the NoSQL database (Mongo)
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

module.exports = new Database();
