import Sequelize, { Model } from 'sequelize';

class Foods extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      as: 'restaurant',
    });
    this.belongsTo(models.File, {
      foreignKey: 'file_id',
      as: 'avatar',
    });
  }
}

export default Foods;
