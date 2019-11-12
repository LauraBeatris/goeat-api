const Sequelize = require('sequelize');
const { Model } = require('sequelize');

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

module.exports = File;
