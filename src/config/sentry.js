const dotenv = require('dotenv');

dotenv.config({});

module.exports = {
  dsn: process.env.SENTRY_URL,
};
