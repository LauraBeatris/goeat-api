"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _File = require('../models/File'); var _File2 = _interopRequireDefault(_File);

class FileController {
  async store(req, res) {
    // Image informations that came from multer middleware
    const { image: name, imageLocation: url } = req;

    // Validating data
    if (!name || !url) {
      return res.status(420).json({ error: 'Invalid data' });
    }

    // Checking if a file with that name already exists
    const existFile = await _File2.default.findOne({
      where: { name },
    });

    if (existFile) {
      return res
        .status(401)
        .json({ error: 'Already exists a file with that same name' });
    }

    const { id } = await _File2.default.create({ name, url });
    return res.json({
      id,
      url,
    });
  }

  async show(req, res) {
    const { file_id } = req.params;

    // Data validation
    if (!file_id) {
      return res.status(401).json({ error: 'File id not provided' });
    }

    // Finding the file with the respective id
    const file = await _File2.default.findByPk(file_id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { id, name, url } = file;

    return res.json({ id, name, url });
  }

  async index(req, res) {
    const files = await _File2.default.findAll();

    return res.json(files);
  }
}

exports. default = new FileController();
