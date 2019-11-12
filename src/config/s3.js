const AWS = require('aws-sdk');

const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

module.exports = new AWS.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME,
});
