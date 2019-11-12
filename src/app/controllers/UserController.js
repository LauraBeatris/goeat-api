const Joi = require('joi');
const Yup = require('yup');
const User = require('../models/User');

// TO DO - Use Joi for validation
class UserController {
  async store(req, res) {
    // Input data validation
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6),
      file_id: Joi.number().required(),
    });

    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    // Verifying if there's another user with the same email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(404).json({ error: 'User already exists.' });
    }

    // Creating the user
    const { id, name, email, file_id } = await User.create(req.body);
    return res.json({ id, name, email, file_id });
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
    const user = await User.findByPk(req.userId);

    /*
      Comparing emails
      If it's different from the current one, we need to verify if there isn't a user
      already using this same email.
    */
    if (passedEmail !== user.email) {
      const userExists = await User.findOne({
        where: { email: passedEmail },
      });

      if (userExists) {
        return res
          .status(401)
          .json({ error: 'Already exists a user using this email' });
      }
    }

    // Verifying the oldPassword
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name, email } = await user.update(req.body);

    return res.json({ id, name, email });
  }
}
module.exports = new UserController();
