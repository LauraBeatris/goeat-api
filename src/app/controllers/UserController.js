import User from '../models/User';

class UserController {
  async store(req, res) {
    // Verifying if there's another user with the same email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(404).json({ error: 'User already exists.' });
    }

    // Creating the user
    const { name, email } = await User.create(req.body);
    return res.json({ name, email });
  }

  async update(req, res) {
    const { email: passedEmail, oldPassword } = req.body;

    // Finding the user register
    const user = await User.findByPk(req.userId);

    /*
      Comparing emails
      If it's different from the current one, we need to verify if there isn't a user
      already using this same email.
    */
    if (passedEmail !== user.email) {
      const userExists = await User.findOne({
        where: { passedEmail },
      });

      if (userExists) {
        return res
          .status(404)
          .json({ error: 'Already exists a user using this email' });
      }
    }

    // Verifying the oldPassword
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const { id, name, email } = user.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
