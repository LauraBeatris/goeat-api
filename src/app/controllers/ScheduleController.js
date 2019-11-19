const { startOfDay, endOfDay, parseISO } = require('date-fns');
const { Op } = require('sequelize');
const File = require('../models/File');
const Appointment = require('../models/Appointment');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

class ScheduleController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    // Listing all the appointments related to the owned restaurants of the provider
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(400).json({
        err: "It's not possible to find a restaurant without pass the id",
      });
    }

    // Finding the restaurant
    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({
        err: 'Restaurant not found',
      });
    }

    // Date Query Operations - Filtering by day
    const parsedDate = parseISO(date);
    const queryDate = {};
    if (date)
      queryDate.date = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };

    // Finding the appointments of the restaurant which wasn't cancelled
    const appointments = await Appointment.findAll({
      where: {
        restaurant_id,
        canceled_at: null,
        ...queryDate,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past'],
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
              attributes: ['id', 'url', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }
}

module.exports = new ScheduleController();
