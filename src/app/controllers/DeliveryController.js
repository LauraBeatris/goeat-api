const Joi = require('joi');
const { Op } = require('sequelize');
const { format } = require('date-fns');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const File = require('../models/File');

class DeliveryController {
  // Storing the first delivery informations
  async store(req, res) {
    const schema = Joi.object().keys({
      status: Joi.string().required(),
      message: Joi.string().required(),
    });

    // Input data validation
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    // Validating same deliveries

    const { order_id } = req.params;

    // Finding the order related to the delivery
    if (!order_id) return res.status(400).json({ err: 'Order id not found' });
    const order = await Order.findOne({
      where: {
        id: order_id,
        canceled_at: null,
        delivered_at: null,
        food_id: { [Op.not]: null },
      },
      attributes: ['id', 'cancelable', 'date', 'created_at', 'updated_at'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [{ model: File, as: 'avatar', attributes: ['url'] }],
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name'],
          include: [{ model: File, as: 'avatar', attributes: ['url'] }],
        },
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'price', 'type'],
          include: [{ model: File, as: 'avatar', attributes: ['url'] }],
        },
      ],
    });
    if (!order) return res.status(404).json({ err: 'Order not found' });

    // Creating the delivery data
    const { message, status } = req.body;

    const { id } = await Delivery.create({
      message,
      status,
      order: order_id,
    });

    return res.json({ id, message, status, order });
  }

  // Updating the delivery informations
  async update(req, res) {
    const schema = Joi.object().keys({
      status: Joi.string(),
      message: Joi.string(),
    });

    // Input data validation
    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    // Finding and validation the current delivery data
    const { delivery_id } = req.params;
    const delivery = await Delivery.findByPk(delivery_id);
    if (!delivery) return res.status(404).json({ err: 'Delivery not found' });

    await delivery.update(req.body);
    return res.json(delivery);
  }

  // Deleting the delivery informations when it's already checked
  async delete(req, res) {
    // Finding and validation the current delivery data
    const { delivery_id } = req.params;
    const delivery = await Delivery.findByPk(delivery_id);
    if (!delivery) return res.status(404).json({ err: 'Delivery not found' });

    const order = await Order.findByPk(delivery.order);

    // Updating the order with the delivered date
    order.delivered_at = Date.now();
    await order.save();

    // Deleting the deliveries informations of the order since it was finished
    await delivery.destroy();
    return res.json({
      msg: `The order ${order.id} was finished at ${format(
        order.delivered_at,
        "dddd, d 'of' MMMM, yyyy"
      )}`,
    });
  }
}

module.exports = new DeliveryController();
