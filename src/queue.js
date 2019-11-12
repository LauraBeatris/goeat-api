const dotenv = require('dotenv');
const Queue = require('./lib/Queue');

dotenv.config({});

Queue.processQueue();
