"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);
var _Provider = require('../models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);
var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);

class ProviderController {
  async store(req, res) {
    // Input data validation
    const schema = _joi2.default.object().keys({
      name: _joi2.default.string().required(),
      email: _joi2.default.string()
        .email()
        .required(),
      password: _joi2.default.string()
        .min(6)
        .required(),
    });

    await _joi2.default.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { email } = req.body;

    // Verifying if there's another user with the same email
    const providerExists = await _Provider2.default.findOne({ where: { email } });
    if (providerExists) {
      return res
        .status(401)
        .json({ error: 'Already exists a provider using this email' });
    }

    // Creating the provider
    const { id, name } = await _Provider2.default.create(req.body);

    return res.json({ id, name, email });
  }

  async index(req, res) {
    const providers = await _Provider2.default.findAll({
      where: {},
      attributes: ['id', 'name', 'email'],
      include: [{ model: _File2.default, as: 'avatar', attributes: ['name', 'path'] }],
    });

    return res.json({ providers });
  }
}

exports. default = new ProviderController();
