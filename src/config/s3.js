import AWS from 'aws-sdk';

// Creating S3 Config
export default new AWS.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  ContentType: 'image/jpeg',
  Bucket: process.env.AWS_BUCKET_NAME,
});
