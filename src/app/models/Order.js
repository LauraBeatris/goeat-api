const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { isBefore, subHours } = require('date-fns');

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          /*
            Returning an boolean value, verifying if the appointment didn't happen until
            the schedule date
          */
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 1));
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
    this.belongsTo(models.Foods, { foreignKey: 'food_id', as: 'food' });
  }
}

module.exports = Order;
