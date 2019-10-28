import Restaurant from '../models/Restaurant';

class RestaurantController {
  async store(req, res) {}

  async index(req, res) {
    const restaurants = await Restaurant.findAll({
      where: {},
      attributes: [
        'id',
        'name',
        'street_address',
        'number_address',
        'description',
      ],
    });

    return res.json({ restaurants });
  }
}

export default new RestaurantController();
