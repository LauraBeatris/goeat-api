"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _Restaurant = require('../models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);
var _Food = require('../models/Food'); var _Food2 = _interopRequireDefault(_Food);

class FoodController {
  // Listing all the foods of the restaurant
  async index(req, res) {
    const { restaurant_id } = req.params;
    const { type = null } = req.query;

    if (!restaurant_id) {
      return res.status(404).json({
        err:
          "It's not possible to listing the foods without pass the restaurant id",
      });
    }

    // Editing query object
    const query = {
      restaurant_id,
    };

    if (type) {
      query.type = type;
    }

    const foods = await _Food2.default.findAll({
      where: { ...query },
      attributes: ['name', 'type', 'price'],
      include: [
        {
          model: _Restaurant2.default,
          as: 'restaurant',
        },
      ],
    });
    return res.json({ foods });
  }

  async store(req, res) {
    const schema = _joi2.default.object().keys({
      name: _joi2.default.string().required(),
      price: _joi2.default.number().required(),
      file_id: _joi2.default.number().required(),
      type: _joi2.default.string().required(),
    });

    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(404).json({
        err:
          "It's not possible to create a food without pass the restaurant id",
      });
    }

    const restaurant = await _Restaurant2.default.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({
        err: 'Restaurant not found',
      });
    }

    // Creating the food
    const food = await _Food2.default.create(req.body);
    // Relationship with the restaurant
    await restaurant.addFood(food.id);

    return res.json(food);
  }
}

exports. default = new FoodController();
