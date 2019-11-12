"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _Queue = require('./lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);

_dotenv2.default.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

_Queue2.default.processQueue();
