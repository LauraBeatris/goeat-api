import multer from 'multer';
import dotenv from 'dotenv';

import multerS3 from 'multer-s3';
import path from 'path';

import s3Config from './s3';

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
export default (req, res) => {
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

      // TO DO -> Save the file name into database into profile model
      return res.json({
        image: imageName,
        location: imageLocation,
      });
    }
  });
};
