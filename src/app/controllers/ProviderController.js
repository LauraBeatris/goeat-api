import Provider from '../models/Provider';
import File from '../models/File';

class ProviderController {
  async store(req, res) {}

  async index(req, res) {
    const providers = await Provider.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
      include: [{ model: File, as: 'avatar' }],
    });

    const provider = await Provider.findByPk(4);
    provider.addRestaurant(1);

    return res.json({ providers });
  }
}

export default new ProviderController();
