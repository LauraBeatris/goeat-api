"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _Restaurant = require('../models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);
var _Provider = require('../models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);

class RestaurantController {
  async index(req, res) {
    const { provider_id } = req.params;

    // TO DO -> Filtering by address and if it's open

    // Filters
    const {
      city = null,
      state = null,
      street = null,
      country = null,
      page = 1,
    } = req.query;
    const query = {};

    if (city) {
      query.city_address = city;
    }

    if (state) {
      query.state_address = state;
    }

    if (street) {
      query.street_address = street;
    }

    if (country) {
      query.country_address = country;
    }

    let restaurants;

    if (!provider_id) {
      // Returning all the restaurants
      restaurants = await _Restaurant2.default.findAll({
        where: { ...query, is_open: true },
        limit: 20,
        offset: (page - 1) * 20,
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'state_address',
          'city_address',
          'description',
        ],
        include: [
          { model: _File2.default, as: 'avatar', attributes: ['path', 'name', 'url'] },
        ],
      });
    } else {
      // Returning the restaurants owned by the provider
      restaurants = await _Restaurant2.default.findAll({
        where: { provider_id, is_open: true },
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'country_address',
          'description',
        ],
        include: [{ model: _File2.default, as: 'avatar', attributes: ['name', 'path'] }],
      });
    }

    return res.json({ restaurants });
  }

  async store(req, res) {
    const schema = _joi2.default.object().keys({
      name: _joi2.default.string().required(),
      street_address: _joi2.default.string().required(),
      number_address: _joi2.default.number().required(),
      city_address: _joi2.default.string().required(),
      state_address: _joi2.default.string().required(),
      country_address: _joi2.default.string().required(),
      file_id: _joi2.default.number(),
      is_closed: _joi2.default.boolean(),
    });

    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { name } = req.body;

    const restaurantExists = await _Restaurant2.default.findOne({ where: { name } });
    if (restaurantExists) {
      return res
        .status(404)
        .json({ err: 'A restaurant with that name already exists' });
    }

    // Finding the provider / Future owner
    const provider = await _Provider2.default.findByPk(req.userId);

    let restaurantData;
    if (provider) {
      // Creating the restauran

      const restaurant = await _Restaurant2.default.create({
        ...req.body,
        provider_id: req.userId,
      });
      restaurantData = restaurant;

      // Creating the owner relationship with the restaurant
    } else {
      return res.status(404).json({ err: 'The provider was not found' });
    }

    return res.json(restaurantData);
  }
}

exports. default = new RestaurantController();
