import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Restaurant from '../app/models/Restaurant';
import Provider from '../app/models/Provider';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Foods from '../app/models/Food';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
});

const models = [User, Restaurant, Provider, File, Appointment, Foods];

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

export default new Database();
