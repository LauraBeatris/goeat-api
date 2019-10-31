import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Restaurant from '../app/models/Restaurant';
import Provider from '../app/models/Provider';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Food from '../app/models/Food';

const models = [User, Restaurant, Provider, File, Appointment, Food];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));

    const associatedModels = models.filter(
      model => typeof model.associate === 'function'
    );

    associatedModels.map(model => model.associate(this.connection.models));
  }
}

export default new Database();
