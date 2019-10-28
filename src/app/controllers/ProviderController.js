import Provider from '../models/Provider';

class ProviderController {
  async store(req, res) {}

  async index(req, res) {
    const providers = await Provider.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
    });

    return res.json({ providers });
  }
}

export default new ProviderController();
