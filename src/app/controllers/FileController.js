import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { id } = await File.create({ name, path });
    return res.json({ id, path });
  }
}

export default new FileController();
