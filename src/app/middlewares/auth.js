const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifying if the token is in the auth header or else, the user isn't allowed to proceed
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Token not provided - User not allowed' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Passing the id to the next routes
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(404).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
