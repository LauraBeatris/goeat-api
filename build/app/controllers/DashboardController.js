"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Restaurant = require('../models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);

class DashboardController {
  // Opening the the choosed restaurant - Provider screen
  async store(req, res) {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(401).json({ error: 'Restaurant id not provided' });
    }

    const restaurant = await _Restaurant2.default.findByPk(restaurant_id);
    restaurant.is_open = true;
    await restaurant.save();

    return res.json(restaurant);
  }

  // Closing the choosed restaurant - Provider screen
  async delete(req, res) {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(401).json({ error: 'Restaurant id not provided' });
    }

    const restaurant = await _Restaurant2.default.findByPk(restaurant_id);
    restaurant.is_open = false;
    await restaurant.save();

    return res.json(restaurant);
  }
}

exports. default = new DashboardController();
