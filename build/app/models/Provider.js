"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class Provider extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async provider => {
      if (provider.password) {
        provider.password_hash = await _bcryptjs2.default.hash(provider.password, 8);
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
    return _bcryptjs2.default.compare(password, this.password_hash);
  }
}

exports. default = Provider;
