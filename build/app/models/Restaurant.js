"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Restaurant extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        street_address: _sequelize2.default.STRING,
        number_address: _sequelize2.default.STRING,
        city_address: _sequelize2.default.STRING,
        state_address: _sequelize2.default.STRING,
        country_address: _sequelize2.default.STRING,
        description: _sequelize2.default.STRING,
        is_open: _sequelize2.default.BOOLEAN,
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

exports. default = Restaurant;
