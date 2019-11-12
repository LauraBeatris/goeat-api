function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const _dotenv = require('dotenv');

const _dotenv2 = _interopRequireDefault(_dotenv);
const _Queue = require('./lib/Queue');

const _Queue2 = _interopRequireDefault(_Queue);

_dotenv2.default.config({});

_Queue2.default.processQueue();
