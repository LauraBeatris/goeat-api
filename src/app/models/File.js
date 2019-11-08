import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default File;
