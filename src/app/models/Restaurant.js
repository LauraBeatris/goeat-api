import Sequelize, { Model } from 'sequelize';

class Restaurant extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street_address: Sequelize.STRING,
        number_address: Sequelize.STRING,
        city_address: Sequelize.STRING,
        state_address: Sequelize.STRING,
        country_address: Sequelize.STRING,
        description: Sequelize.STRING,
        is_open: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'avatar' });
    this.belongsTo(models.Provider, {
      foreignKey: 'provider_id',
      as: 'restaurant',
    });
    this.hasMany(models.Foods, { foreignKey: 'restaurant_id', as: 'food' });
  }
}

export default Restaurant;
