import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name } = req.file;

    if (!name) {
      return res.status(420).json({ error: 'Invalid data' });
    }

    const existFile = await File.findOne({
      where: { name: name + new Date() },
    });

    if (existFile) {
      return res
        .status(401)
        .json({ error: 'Already exists a file with that same name' });
    }

    const { id } = await File.create({ name: name + new Date() });
    return res.json({
      id,
      url: `https://goeat-files.s3.us-east-2.amazonaws.com/${name +
        req.userId}`,
    });
  }

  async index(req, res) {
    const files = await File.findAll();

    return res.json(files);
  }
}

export default new FileController();
