"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _redis = require('redis'); var _redis2 = _interopRequireDefault(_redis);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  db: 0,
  options: {},
  retry_strategy(options) {
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
};

const redisClient = _redis2.default.createClient(redisOptions);

redisClient.on('end', () => {
  console.log('REDIS connection has been closed');
});
redisClient.on('error', err => {
  console.log('REDIS client %o', err);
});

exports. default = redisClient;
