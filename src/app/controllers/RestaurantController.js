import Restaurant from '../models/Restaurant';
import File from '../models/File';
import Provider from '../models/Provider';

class RestaurantController {
  async store(req, res) {}

  async index(req, res) {
    const { provider_id } = req.params;

    let restaurants;

    if (!provider_id) {
      // Returning all the restaurants
      restaurants = await Restaurant.findAll({
        where: {},
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'description',
        ],
        include: [{ model: File }],
      });
    } else {
      // Returning the restaurants owned by the provider
      restaurants = await Restaurant.findAll({
        where: { provider_id },
        attributes: [
          'id',
          'name',
          'street_address',
          'number_address',
          'description',
        ],
        include: [{ model: File }],
      });
    }

    return res.json({ restaurants });
  }
}

export default new RestaurantController();
