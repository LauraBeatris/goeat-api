import Sequelize, { Model } from 'sequelize';

import Restaurant from './Restaurant';

class Provider extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.myAssociation = this.hasMany(Restaurant);
  }
}

export default Provider;
