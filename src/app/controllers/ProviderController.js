import Joi from 'joi';
import Provider from '../models/Provider';
import File from '../models/File';

class ProviderController {
  async store(req, res) {
    // Input data validation
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    });

    Joi.validate(
      req.body,
      schema,
      err => err && res.status(422).json({ err: err.details })
    );

    const { email } = req.body;

    // Verifying if there's another user with the same email
    const providerExists = await Provider.findOne({ where: { email } });
    if (providerExists) {
      return res
        .status(401)
        .json({ error: 'Already exists a provider using this email' });
    }

    // Creating the provider
    const { id, name } = await Provider.create(req.body);

    return res.json({ id, name, email });
  }

  async index(req, res) {
    const providers = await Provider.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
      include: [{ model: File, as: 'avatar', attributes: ['name', 'path'] }],
    });

    return res.json({ providers });
  }
}

export default new ProviderController();
