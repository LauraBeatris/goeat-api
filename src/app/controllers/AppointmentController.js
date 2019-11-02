import Joi from 'joi';
import {
  parseISO,
  isBefore,
  endOfDay,
  startOfDay,
  format,
  subHours,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
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
        .status(400)
        .json({ err: "It's not allowed to do appointments in past dates" });
    }

    // Checking if the date it's available for booking
    const checkAvailability = await Appointment.findOne({ where: { date } });

    if (checkAvailability) {
      return res.status(400).json({ err: 'This date already was booked' });
    }

    /*
      Creating the appointments and his notification
    */

    // Getting name of the user
    const { name: userName } = await User.findByPk(req.userId);
    const { name: restaurantName } = restaurant;
    const formattedDate = format(
      parseISO(date),
      "'day' dd 'of' MMMM',' H:mm 'hours'"
    );
    const appointment = await Appointment.create({
      date,
      user_id: req.userId,
      restaurant_id,
    });
    await Notification.create({
      content: `New appointment - ${restaurantName} - by ${userName} for ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1, date } = req.query;

    // Finding the user
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        err: 'User not found',
      });
    }

    // Date Validation Operations - Filtering by day
    const parsedDate = parseISO(date);
    const queryDate = {};
    if (date)
      queryDate.date = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };

    // Finding the appointments of the user which wasn't cancelled
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null, ...queryDate },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: [
            'id',
            'name',
            'street_address',
            'number_address',
            'city_address',
            'state_address',
          ],
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

    return res.json({ appointments });
  }

  async delete(req, res) {
    const { appointment_id } = req.params;

    if (!appointment_id) {
      return res.status(404).json({
        error: "It's not possible to cancel an appointment with passing an id",
      });
    }

    const appointment = await Appointment.findByPk(appointment_id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // The user can cancel only his/her appointments - Verifying if the id is different
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    // It's just allowed to cancel appointments with 1 hour of advance
    const dateWithSub = subHours(appointment.date, 1);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments with 1 hour of advance',
      });
    }

    // Changing the field canceled_at with the current date
    appointment.canceled_at = new Date();
    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
