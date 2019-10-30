import Joi from 'joi';
import Restaurant from '../models/Restaurant';
import Provider from '../models/Provider';
import File from '../models/File';

class RestaurantController {
  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      street_address: Joi.string().required(),
      number_address: Joi.number().required(),
      // city_address: Joi.string().required(),
      file_id: Joi.number(),
    });

    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { name } = req.body;

    const restaurantExists = await Restaurant.findOne({ where: { name } });
    if (restaurantExists) {
      return res
        .status(404)
        .json({ err: 'A restaurant with that name already exists' });
    }

    // Finding the provider / Future owner
    const provider = await Provider.findByPk(req.userId);

    let restaurantData;
    if (provider) {
      // Creating the restaurant
      const restaurant = await Restaurant.create(req.body);
      restaurantData = restaurant;

      // Creating the owner relationship with the restaurant
      provider.addRestaurant(restaurant.id);
    } else {
      return res.status(404).json({ err: 'The provider was not found' });
    }

    return res.json(restaurantData);
  }

  async index(req, res) {
    const { provider_id } = req.params;

    let restaurants;

    if (!provider_id) {
      // Returning all the restaurants
      restaurants = await Restaurant.findAll({
        where: {},
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'description',
        ],
        include: [
          { model: File, as: 'avatar', attributes: ['path', 'name', 'url'] },
        ],
      });
    } else {
      // Returning the restaurants owned by the provider
      restaurants = await Restaurant.findAll({
        where: { provider_id },
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'description',
        ],
        include: [{ model: File, as: 'avatar', attributes: ['name', 'path'] }],
      });
    }

    return res.json({ restaurants });
  }
}

export default new RestaurantController();
