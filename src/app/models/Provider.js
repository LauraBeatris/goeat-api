import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Provider extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async provider => {
      if (provider.password) {
        provider.password_hash = await bcrypt.hash(provider.password, 8);
      }
    });
  }

  static associate(models) {
    this.hasMany(models.Restaurant, { foreignKey: 'provider_id' });
    this.belongsTo(models.File, { foreignKey: 'file_id' });
  }
}

export default Provider;
