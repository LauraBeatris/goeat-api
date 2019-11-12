"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _datefns = require('date-fns');

class Appointment extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        date: _sequelize2.default.DATE,
        canceled_at: _sequelize2.default.DATE,
        past: {
          type: _sequelize2.default.VIRTUAL,
          /*
            Returning an boolean value, verifying if the appointment didn't happen until
            the schedule date
          */
          get() {
            return _datefns.isBefore.call(void 0, this.date, new Date());
          },
        },
        cancelable: {
          type: _sequelize2.default.VIRTUAL,
          get() {
            return _datefns.isBefore.call(void 0, new Date(), _datefns.subHours.call(void 0, this.date, 1));
          },
        },
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      as: 'restaurant',
    });
  }
}

exports. default = Appointment;
