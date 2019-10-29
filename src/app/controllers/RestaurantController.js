import Joi from 'joi';
import Restaurant from '../models/Restaurant';
import File from '../models/File';

class RestaurantController {
  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      street_address: Joi.string().required(),
      number_address: Joi.number().required(),
      // city_address: Joi.string().required(),
    });

    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err });
      }
      return null;
    });

    const { name } = req.body;

    const restaurantExists = await Restaurant.findOne({ where: { name } });
    if (restaurantExists) {
      return res
        .status(404)
        .json({ err: 'A restaurant with that name already exists' });
    }

    const {
      id,
      street_address,
      number_address,
      city_address,
    } = await Restaurant.create(req.body);
    return res.json({ id, name, street_address, number_address, city_address });
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
        include: [{ model: File }],
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
        include: [{ model: File, as: 'avatar' }],
      });
    }

    return res.json({ restaurants });
  }
}

export default new RestaurantController();
