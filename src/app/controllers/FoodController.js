import Joi from 'joi';
import Food from '../models/Food';

class FoodController {
  async store(req, res) {
    const schema = Joi.object().schema({
      name: Joi.string().required(),
      price: Joi.number().required(),
      file_id: Joi.number().required(),
    });

    Joi.validate(req.body, schema, err => {
      if (err) {
        return res.status(422).json({ err: err.details });
      }
    });

    const { name, price, file_id } = req.body;

    const { id } = await Food.create({ name, price, file_id });
    return res.json({ id, name, price });
  }
}

export default new FoodController();
