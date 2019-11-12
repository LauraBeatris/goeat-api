"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);







var _datefns = require('date-fns');
var _sequelize = require('sequelize');

var _Queue = require('../../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);
var _CancellationMail = require('../jobs/CancellationMail'); var _CancellationMail2 = _interopRequireDefault(_CancellationMail);
var _Appointment = require('../models/Appointment'); var _Appointment2 = _interopRequireDefault(_Appointment);
var _Restaurant = require('../models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Provider = require('../models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);
var _Notification = require('../schemas/Notification'); var _Notification2 = _interopRequireDefault(_Notification);

class AppointmentController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    // Finding the user
    const user = await _User2.default.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        err: 'User not found',
      });
    }

    // Date Query Operations - Filtering by day
    const parsedDate = _datefns.parseISO.call(void 0, date);
    const queryDate = {};
    if (date)
      queryDate.date = {
        [_sequelize.Op.between]: [_datefns.startOfDay.call(void 0, parsedDate), _datefns.endOfDay.call(void 0, parsedDate)],
      };

    // Finding the appointments of the user which wasn't cancelled
    const appointments = await _Appointment2.default.findAll({
      where: { user_id: req.userId, canceled_at: null, ...queryDate },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: _Restaurant2.default,
          as: 'restaurant',
          attributes: ['id', 'name', 'street_address', 'number_address'],
        },
        {
          model: _User2.default,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: _File2.default,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }

  async store(req, res) {
    const schema = _joi2.default.object().keys({
      date: _joi2.default.date().required(),
      restaurant_id: _joi2.default.number()
        .integer()
        .required(),
    });

    await _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { date, restaurant_id } = req.body;

    // Finding restaurant
    const restaurant = await _Restaurant2.default.findByPk(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { provider_id } = restaurant;

    /*
      Date verifications
    */

    // Verifying if it isn't a past date
    if (_datefns.isBefore.call(void 0, _datefns.parseISO.call(void 0, date), new Date())) {
      return res
        .status(400)
        .json({ err: "It's not allowed to do appointments in past dates" });
    }

    // Checking if the date it's available for booking
    const checkAvailability = await _Appointment2.default.findOne({
      where: { date, canceled_at: null, restaurant_id },
    });
    if (checkAvailability) {
      return res.status(400).json({ err: 'This date already was booked' });
    }

    /*
      Creating the appointments and his notification
    */

    // Getting name of the user
    const { name: userName } = await _User2.default.findByPk(req.userId);
    const { name: restaurantName } = restaurant;
    const formattedDate = _datefns.format.call(void 0, 
      _datefns.parseISO.call(void 0, date),
      "'day' dd 'of' MMMM',' H:mm 'hours'"
    );
    const appointment = await _Appointment2.default.create({
      date,
      user_id: req.userId,
      restaurant_id,
    });
    await _Notification2.default.create({
      content: `New appointment - ${restaurantName} - by ${userName} for ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const { appointment_id } = req.params;

    if (!appointment_id) {
      return res.status(404).json({
        error: "It's not possible to cancel an appointment with passing an id",
      });
    }

    const appointment = await _Appointment2.default.findOne({
      where: { id: appointment_id },
      include: [
        {
          model: _Restaurant2.default,
          as: 'restaurant',
          include: [
            {
              model: _Provider2.default,
              as: 'restaurant',
            },
          ],
        },
        {
          model: _User2.default,
          as: 'user',
        },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment && appointment.canceled_at !== null) {
      return res
        .status(420)
        .json({ error: 'This appointment was already canceled' });
    }

    // The user can cancel only his/her appointments - Verifying if the id is different
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    // It's just allowed to cancel appointments with 1 hour of advance
    const dateWithSub = _datefns.subHours.call(void 0, appointment.date, 1);

    if (_datefns.isBefore.call(void 0, dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments with 1 hour of advance',
      });
    }

    // Changing the field canceled_at with the current date
    appointment.canceled_at = new Date();
    await appointment.save();

    const formatedDate = _datefns.format.call(void 0, 
      appointment.date,
      "'Day' dd 'of' MMMM',' H:mm 'Hours'"
    );

    await _Queue2.default.queue.create(_CancellationMail2.default.key, {
      appointment,
      formatedDate,
    });
    return res.json(appointment);
  }
}

exports. default = new AppointmentController();
