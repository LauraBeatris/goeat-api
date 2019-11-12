const AWS = require('aws-sdk');

const dotenv = require('dotenv');

dotenv.config({});

module.exports = new AWS.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME,
});
