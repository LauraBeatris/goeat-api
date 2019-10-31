import Joi from 'joi';
import Restaurant from '../models/Restaurant';
import Food from '../models/Food';

class FoodController {
  // Listing all the foods of the restaurant
  async index(req, res) {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(404).json({
        err:
          "It's not possible to create a food without pass the restaurant id",
      });
    }

    const foods = await Food.findAll({ where: { restaurant_id } });
    return res.json({ foods });
  }

  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().required(),
      file_id: Joi.number().required(),
      restaurant_id: Joi.number().required(),
    });

    Joi.validate(req.body, schema, err => {
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

    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({
        err: 'Restaurant not found',
      });
    }

    const { name, price, file_id } = req.body;

    // Creating the food
    const { id } = await Food.create({ name, price, file_id });
    // Relationship with the restaurant
    await restaurant.addFood(id);

    return res.json({ id, name, price });
  }
}

export default new FoodController();
