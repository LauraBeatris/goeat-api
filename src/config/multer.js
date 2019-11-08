import multer from 'multer';
import dotenv from 'dotenv';

import multerS3 from 'multer-s3';
import { extname } from 'path';

import s3Config from './s3';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    return cb(
      null,
      file.originalname + req.userId + extname(file.originalname)
    );
  },
});

export default multer({
  storage: multerS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
