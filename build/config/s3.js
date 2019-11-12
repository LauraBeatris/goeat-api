function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
Object.defineProperty(exports, '__esModule', { value: true });
const _awssdk = require('aws-sdk');

const _awssdk2 = _interopRequireDefault(_awssdk);

const _dotenv = require('dotenv');

const _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const bucket = new _awssdk2.default.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME,
});

// Creating S3 Config
exports.default = bucket;
