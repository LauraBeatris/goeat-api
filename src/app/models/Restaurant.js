import Sequelize, { Model } from 'sequelize';

import Provider from './Provider';

class Restaurant extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street_address: Sequelize.STRING,
        number_address: Sequelize.STRING,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate() {
    this.myAssociation = this.hasOne(Provider);
  }
}

export default Restaurant;