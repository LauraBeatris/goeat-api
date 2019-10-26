import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import Restaurant from './Restaurant';

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

  static associate() {
    this.myAssociation = this.hasMany(Restaurant);
  }
}

export default Provider;
