"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _redis = require('redis'); var _redis2 = _interopRequireDefault(_redis);

const client = _redis2.default.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0,
  options: {},
  retry_strategy(options) {
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

exports. default = client;
