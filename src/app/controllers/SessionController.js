import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // Verifying if the user exists
    if (!user) {
      // Then, not allowed - 401
      return res.json(401).json({ error: 'User not found' });
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
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      }),
    });
  }
}

export default new SessionController();