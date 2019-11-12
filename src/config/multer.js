const multer = require('multer');
const dotenv = require('dotenv');

const multerS3 = require('multer-s3');
const path = require('path');

const s3Config = require('./s3');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

// Setting multer with s3
const multerS3Config = multer({
  storage: multerS3({
    s3: s3Config,
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
        `${path.basename(
          file.originalname,
          path.extname(file.originalname)
        )}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }),
}).single('file');

// Multer Middleware - Sending S3 Object URL or error
module.exports = (req, res, next) => {
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
