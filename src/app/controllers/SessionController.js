const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const User = require('../models/User');
const File = require('../models/File');
const Provider = require('../models/Provider');

class SessionController {
  async store(req, res) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { err } = schema.validate(req.body);
    if (err) {
      return res.status(422).json({ err: err.details });
    }

    const { email, password } = req.body;

    const isProvider = req.query.type !== 'user';
    let user = null;
    if (isProvider) {
      user = await Provider.findOne({
        where: { email },
        attributes: ['id', 'name', 'email', 'password_hash'],
        include: [
          {
            model: File,
            as: 'avatar',
            foreignKey: 'file_id',
            attributes: ['url'],
          },
        ],
      });
    } else {
      user = await User.findOne({
        where: { email },
        attributes: ['id', 'name', 'email', 'password_hash'],
        include: [
          {
            model: File,
            as: 'avatar',
            foreignKey: 'file_id',
            attributes: ['url'],
          },
        ],
      });
    }

    // Verifying if the user exists
    if (!user) {
      // Then, not allowed - 401
      return res
        .status(404)
        .json({ error: `${isProvider ? 'Provider' : 'User'} not found` });
    }

    // Password verification
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
      },
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      }),
    });
  }
}

module.exports = new SessionController();
