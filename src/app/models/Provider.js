const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

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
    this.hasMany(models.Restaurant, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = Provider;
