function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
Object.defineProperty(exports, '__esModule', { value: true });
const _multer = require('multer');

const _multer2 = _interopRequireDefault(_multer);
const _dotenv = require('dotenv');

const _dotenv2 = _interopRequireDefault(_dotenv);

const _multers3 = require('multer-s3');

const _multers32 = _interopRequireDefault(_multers3);
const _path = require('path');

const _path2 = _interopRequireDefault(_path);

const _s3 = require('./s3');

const _s32 = _interopRequireDefault(_s3);

_dotenv2.default.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

// Setting multer with s3
const multerS3Config = _multer2.default
  .call(void 0, {
    storage: _multers32.default.call(void 0, {
      s3: _s32.default,
      bucket: process.env.AWS_BUCKET_NAME,

      // Permissions
      acl: 'public-read',

      // Metadata for the file
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },

      // How the name will look in the bucket
      key(req, file, cb) {
        cb(
          null,
          `${_path2.default.basename(
            file.originalname,
            _path2.default.extname(file.originalname)
          )}-${Date.now()}${_path2.default.extname(file.originalname)}`
        );
      },
    }),
  })
  .single('file');

// Multer Middleware - Sending S3 Object URL or error
exports.default = (req, res, next) => {
  multerS3Config(req, res, error => {
    console.log('File successfully sent', req.file);
    console.log('error', error);

    if (error) {
      console.log('errors', error);
      return res.status(420).json({ error });
    }
    // If file not found
    if (req.file === undefined) {
      console.log('Error: No File Selected!');
      res.json('Error: No File Selected');
    } else {
      // If success
      const imageName = req.file.key;
      const imageLocation = req.file.location;

      // Saving in database
      req.image = imageName;
      req.imageLocation = imageLocation;
      return next();
    }
  });
};
