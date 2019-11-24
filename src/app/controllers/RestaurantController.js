const Joi = require('@hapi/joi');
const Restaurant = require('../models/Restaurant');
const Provider = require('../models/Provider');
const File = require('../models/File');

class RestaurantController {
  async index(req, res) {
    const provider_id = req.userId;

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
      restaurants = await Restaurant.findAll({
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
        include: [{ model: File, as: 'avatar', attributes: ['name', 'url'] }],
      });
    } else {
      // Returning the restaurants owned by the provider
      restaurants = await Restaurant.findAll({
        where: { provider_id, is_open: true },
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'country_address',
          'description',
        ],
        include: [{ model: File, as: 'avatar', attributes: ['name', 'url'] }],
      });
    }

    return res.json({ restaurants });
  }

  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      street_address: Joi.string().required(),
      number_address: Joi.number().required(),
      city_address: Joi.string().required(),
      state_address: Joi.string().required(),
      country_address: Joi.string().required(),
      file_id: Joi.number(),
      is_closed: Joi.boolean(),
    });

    const { err } = schema.validate(req.body);
    if (err) {
      return res.status(422).json({ err: err.details });
    }

    const { name } = req.body;

    const restaurantExists = await Restaurant.findOne({ where: { name } });
    if (restaurantExists) {
      return res
        .status(400)
        .json({ err: 'A restaurant with that name already exists' });
    }

    // Finding the provider / Future owner
    const provider = await Provider.findByPk(req.userId);

    let restaurantData;
    if (provider) {
      // Creating the restauran

      const restaurant = await Restaurant.create({
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

module.exports = new RestaurantController();
