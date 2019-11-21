const Joi = require('joi');
const {
  parseISO,
  isBefore,
  endOfDay,
  startOfDay,
  format,
  subHours,
} = require('date-fns');
const { Op } = require('sequelize');
const Queue = require('../../lib/Queue');

const CancellationMail = require('../jobs/CancellationMail');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Provider = require('../models/Provider');
const File = require('../models/File');
const Notification = require('../schemas/Notification');

class OrderController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    // Finding the user
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        err: 'User not found',
      });
    }

    // Date Query Operations - Filtering by day
    const parsedDate = parseISO(date);
    const queryDate = {};
    if (date)
      queryDate.date = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };

    // Finding the Orders of the user which wasn't cancelled
    const orders = await Order.findAll({
      where: { user_id: req.userId, canceled_at: null, ...queryDate },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'street_address', 'number_address'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ orders });
  }

  async store(req, res) {
    const schema = Joi.object().keys({
      date: Joi.date().required(),
      restaurant_id: Joi.number()
        .integer()
        .required(),
    });

    await Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { date, restaurant_id } = req.body;

    // Finding restaurant
    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { provider_id } = restaurant;
    /*
      Date verifications
    */

    // Verifying if it isn't a past date
    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(401)
        .json({ err: "It's not allowed to do a order in past dates" });
    }

    // Checking if the date it's available for booking
    const checkAvailability = await Order.findOne({
      where: { date, canceled_at: null, restaurant_id },
    });
    if (checkAvailability) {
      return res.status(400).json({ err: 'This date already was booked' });
    }

    /*
      Creating the orders and his notification
    */

    // Getting name of the user
    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).json({ err: 'User not found' });
    const { name: userName } = user;
    const { name: restaurantName } = restaurant;

    const formattedDate = format(
      parseISO(date),
      "'day' dd 'of' MMMM',' H:mm 'hours'"
    );

    const order = await Order.create({
      date,
      user_id: req.userId,
      restaurant_id,
    });

    await Notification.create({
      content: `New order - ${restaurantName} - by ${userName} for ${formattedDate}`,
      user: provider_id,
    });

    return res.json(order);
  }

  async delete(req, res) {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(401).json({
        error: "It's not possible to cancel an order with passing an id",
      });
    }

    const order = await Order.findOne({
      where: { id: order_id },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          include: [
            {
              model: Provider,
              as: 'restaurant',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order && order.canceled_at !== null) {
      return res.status(400).json({ error: 'This order was already canceled' });
    }

    // The user can cancel only his/her orders - Verifying if the id is different
    if (order.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this order",
      });
    }

    // It's just allowed to cancel orders with 1 hour of advance
    const dateWithSub = subHours(order.date, 1);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel orders with 1 hour of advance',
      });
    }

    // Changing the field canceled_at with the current date
    order.canceled_at = new Date();
    await order.save();

    const formatedDate = format(
      order.date,
      "'Day' dd 'of' MMMM',' H:mm 'Hours'"
    );

    await Queue.add(CancellationMail.key, {
      order,
      formatedDate,
    });

    return res.json(order);
  }
}

module.exports = new OrderController();
