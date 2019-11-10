"use strict";const dotenv = require('dotenv');
const Queue = require('./lib/Queue');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

Queue.processQueue();
