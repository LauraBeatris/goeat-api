import dotenv from 'dotenv';
import Queue from './lib/Queue';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

Queue.processQueue();
