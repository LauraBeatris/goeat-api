import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Restaurant from '../app/models/Restaurant';
import Provider from '../app/models/Provider';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Foods from '../app/models/Food';

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
    this.mongoConnection = mongoose.connect(
      'mongodb://laura:123@localhost:27017/goeat',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
