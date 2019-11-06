const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

export default {
  dsn: process.env.SENTRY_URL,
};
