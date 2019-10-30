import Joi from 'joi';
import { getHours, getDate, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';

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
