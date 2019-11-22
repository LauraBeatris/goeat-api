const Joi = require('joi');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Food = require('../models/Food');

class DeliveryController {
  // Storing the first delivery informations
  async store(req, res) {
    const schema = Joi.object().keys({
      status: Joi.string().required(),
      message: Joi.string().required(),
      food_id: Joi.number().required(),
    });

    // Input data validation
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { order_id } = req.params;
    const { food_id } = req.body;

    // Finding the order related to the delivery
    if (!order_id) return res.status(400).json({ err: 'Order id not found' });
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ err: 'Order not found' });

    // Finding the food related to the delivery
    const food = await Food.findByPk(food_id);
    if (!food) return res.status(404).json({ err: 'Food not found' });

    // Creating the delivery data
    const { message, status } = req.body;

    const delivery = await Delivery.create({
      message,
      status,
      order_id,
      food_id,
    });

    return res.json(delivery);
  }

  // Updating the delivery informations
  async update(req, res) {}

  // Deleting the delivery informations when it's already checked
  async delete(req, res) {}
}

module.exports = new DeliveryController();
