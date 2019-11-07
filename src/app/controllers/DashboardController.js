import Restaurant from '../models/Restaurant';

class DashboardController {
  // Opening the the choosed restaurant - Provider screen
  async store(req, res) {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(401).json({ error: 'Restaurant id not provided' });
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    restaurant.is_open = true;
    await restaurant.save();

    return res.json(restaurant);
  }

  // Closing the choosed restaurant - Provider screen
  async delete(req, res) {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(401).json({ error: 'Restaurant id not provided' });
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    restaurant.is_open = false;
    await restaurant.save();

    return res.json(restaurant);
  }
}

export default new DashboardController();
