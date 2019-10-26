import User from '../models/User';

class UserController {
  async store(req, res) {
    // Verifying if there's another user with the same email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(404).json({ error: 'User already exists.' });
    }

    // Creating the user
    const { name, email, password_hash } = await User.create(req.body);
    return res.json({ name, email, password_hash });
  }
}

export default new UserController();
