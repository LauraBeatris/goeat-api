import Notification from '../schemas/Notification';
import Provider from '../models/Provider';

class NotificationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Checking if the user is a provider
    const isProvider = await Provider.findByPk(req.userId);
    if (!isProvider) {
      return res.status(401).json({
        error: 'Only providers can see the appointments notifications',
      });
    }

    // Ordering by createdAt field - Descending
    // The last notification will appear first
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * 20)
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
