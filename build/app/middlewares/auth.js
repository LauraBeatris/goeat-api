"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _util = require('util');

exports. default = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifying if the token is in the auth header or else, the user isn't allowed to proceed
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Token not provided - User not allowed' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await _util.promisify.call(void 0, _jsonwebtoken2.default.verify)(token, process.env.JWT_SECRET);

    // Passing the id to the next routes
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(404).json({ error: 'Invalid token' });
  }
};
