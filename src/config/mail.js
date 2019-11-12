const dotenv = require('dotenv');

dotenv.config({});

module.exports = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Laura Beatris - GoEat Developer<laurabeatriserafim@gmail.com>',
  },
};
