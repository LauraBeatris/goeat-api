import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    // Listing all the appointments related to the owned restaurants of the provider
    const { restaurant_id } = req.query;

    if (!restaurant_id) {
      return res.status(404).json({
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
      attributes: ['id', 'date'],
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
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }
}

export default new ScheduleController();
