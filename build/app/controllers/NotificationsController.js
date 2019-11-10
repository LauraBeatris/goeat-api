"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Notification = require('../schemas/Notification'); var _Notification2 = _interopRequireDefault(_Notification);
var _Provider = require('../models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);

class NotificationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Checking if the user is a provider
    const isProvider = await _Provider2.default.findByPk(req.userId);
    if (!isProvider) {
      return res.status(401).json({
        error: 'Only providers can see the appointments notifications',
      });
    }

    // Ordering by createdAt field - Descending
    // The last notification will appear first
    const notifications = await _Notification2.default.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * 20)
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const { notification_id } = req.params;

    if (!notification_id) {
      return res.status(404).json({
        error:
          "It's not possible to find the notification without passing an id",
      });
    }

    const notification = await _Notification2.default.findByIdAndUpdate(
      notification_id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

exports. default = new NotificationController();
