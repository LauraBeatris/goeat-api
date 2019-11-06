import Queue from './lib/Queue';

const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

Queue.processQueue();
