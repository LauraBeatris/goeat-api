const dotenv = require('dotenv');

dotenv.config({});

export default {
  dsn: process.env.SENTRY_URL,
};
