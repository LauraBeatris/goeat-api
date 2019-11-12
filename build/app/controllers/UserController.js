"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

// TO DO - Use Joi for validation
class UserController {
  async store(req, res) {
    // Input data validation
    const schema = _joi2.default.object().keys({
      name: _joi2.default.string().required(),
      email: _joi2.default.string()
        .email()
        .required(),
      password: _joi2.default.string()
        .required()
        .min(6),
      file_id: _joi2.default.number().required(),
    });

    _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    // Verifying if there's another user with the same email
    const userExists = await _User2.default.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(404).json({ error: 'User already exists.' });
    }

    // Creating the user
    const { id, name, email, file_id } = await _User2.default.create(req.body);
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
    const user = await _User2.default.findByPk(req.userId);

    /*
      Comparing emails
      If it's different from the current one, we need to verify if there isn't a user
      already using this same email.
    */
    if (passedEmail !== user.email) {
      const userExists = await _User2.default.findOne({
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

exports. default = new UserController();
