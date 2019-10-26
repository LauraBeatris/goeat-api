import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Restaurant from '../app/models/Restaurant';
import Provider from '../app/models/Provider';

const models = [User, Restaurant, Provider];

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

    associatedModels.map(model => model.associate(models));
  }
}

export default new Database();
