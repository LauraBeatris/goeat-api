"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _datefns = require('date-fns');
var _sequelize = require('sequelize');

var _Appointment = require('../models/Appointment'); var _Appointment2 = _interopRequireDefault(_Appointment);
var _Restaurant = require('../models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);

class ScheduleController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    // Listing all the appointments related to the owned restaurants of the provider
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(404).json({
        err: "It's not possible to find a restaurant without pass the id",
      });
    }

    // Finding the restaurant
    const restaurant = await _Restaurant2.default.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({
        err: 'Restaurant not found',
      });
    }

    // Date Query Operations - Filtering by day
    const parsedDate = _datefns.parseISO.call(void 0, date);
    const queryDate = {};
    if (date)
      queryDate.date = {
        [_sequelize.Op.between]: [_datefns.startOfDay.call(void 0, parsedDate), _datefns.endOfDay.call(void 0, parsedDate)],
      };

    // Finding the appointments of the restaurant which wasn't cancelled
    const appointments = await _Appointment2.default.findAll({
      where: {
        restaurant_id,
        canceled_at: null,
        ...queryDate,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: _Restaurant2.default,
          as: 'restaurant',
          attributes: ['id', 'name', 'street_address', 'number_address'],
        },
        {
          model: _User2.default,
          as: 'user',
          attributes: ['id', 'name', 'email'],

          include: [
            {
              model: _File2.default,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }
}

exports. default = new ScheduleController();
