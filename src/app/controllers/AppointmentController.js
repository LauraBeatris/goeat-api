import Joi from 'joi';
import { parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const isProvider = req.query.provider === 'true';

    // Listing all the appointments related to the owned restaurants of the provider
    if (isProvider) {
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

      // Finding the appointments of the restaurant which wasn't cancelled
      const appointments = await Appointment.findAll({
        where: { restaurant_id, canceled_at: null },
        order: ['date'],
        attributes: ['id', 'date'],
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

    // Finding the user
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        err: 'User not found',
      });
    }

    // Finding the appointments of the user which wasn't cancelled
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
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
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
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

    /*
      Date verifications
    */

    // Verifying if it isn't a past date
    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(400)
        .json({ err: "It's not allowed to do appointments in past dates" });
    }

    // Checking if the date it's available for booking
    const checkAvailability = await Appointment.findOne({ where: { date } });

    if (checkAvailability) {
      return res.status(400).json({ err: 'This date already was booked' });
    }

    const appointment = await Appointment.create({
      date,
      user_id: req.userId,
      restaurant_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
