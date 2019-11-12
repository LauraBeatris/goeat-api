const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const Provider = require('../models/Provider');

class SessionController {
  async store(req, res) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { email, password } = req.body;

    const isProvider = req.query.type !== 'user';
    let user;
    if (isProvider) {
      user = await Provider.findOne({ where: { email } });
    } else {
      user = await User.findOne({ where: { email } });
    }

    // Verifying if the user exists
    if (!user) {
      // Then, not allowed - 401
      return res
        .status(401)
        .json({ error: `${isProvider ? 'Provider' : 'User'} not found` });
    }

    // Password verification
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      }),
    });
  }
}

module.exports = new SessionController();
