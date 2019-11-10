"use strict";Object.defineProperty(exports, "__esModule", {value: true});const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

exports. default = {
  dsn: process.env.SENTRY_URL,
};
