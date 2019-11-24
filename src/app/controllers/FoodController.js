const Joi = require('@hapi/joi');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

class FoodController {
  async store(req, res) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().required(),
      file_id: Joi.number().required(),
      type: Joi.string().required(),
      description: Joi.string().required(),
    });

    const { err } = schema.validate(req.body);
    if (err) {
      return res.status(422).json({ err: err.details });
    }

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

    // Verifying the the restaurant already have this food
    const existingFood = await Food.findOne({
      where: {
        restaurant_id,
        name: req.body.name,
      },
    });

    if (existingFood)
      return res
        .status(401)
        .json({ err: 'This restaurant already have that food registed' });

    // Creating the food
    const food = await Food.create({ ...req.body, restaurant_id });
    // Relationship with the restaurant
    await restaurant.addFood(food.id);

    return res.json(food);
  }

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

    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant)
      return res.status(404).json({ err: 'Restaurant not found' });

    // Editing query object
    const query = {
      restaurant_id,
    };

    if (type) {
      query.type = type;
    }

    const foods = await Food.findAll({
      where: { ...query },
      attributes: ['name', 'type', 'price'],
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
        },
      ],
    });

    return res.json({ foods });
  }
}

module.exports = new FoodController();
