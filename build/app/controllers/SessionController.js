"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Provider = require('../models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const isProvider = req.query.type !== 'user';
    let user;
    if (isProvider) {
      user = await _Provider2.default.findOne({ where: { email } });
    } else {
      user = await _User2.default.findOne({ where: { email } });
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
      token: _jsonwebtoken2.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      }),
    });
  }
}

exports. default = new SessionController();
