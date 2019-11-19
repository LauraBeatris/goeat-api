const Joi = require('joi');
const Yup = require('yup');
const File = require('../models/File');
const Provider = require('../models/Provider');

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

    await Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),

      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email: passedEmail, oldPassword } = req.body;

    // Finding the user register
    const provider = await Provider.findByPk(req.userId);

    /*
      Comparing emails
      If it's different from the current one, we need to verify if there isn't a user
      already using this same email.
    */
    if (passedEmail !== provider.email) {
      const userExists = await Provider.findOne({
        where: { email: passedEmail },
      });

      if (userExists) {
        return res
          .status(401)
          .json({ error: 'Already exists a user using this email' });
      }
    }

    // Verifying the oldPassword
    if (oldPassword && !(await provider.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name, email } = await provider.update(req.body);
    await provider.save();

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

module.exports = new ProviderController();
