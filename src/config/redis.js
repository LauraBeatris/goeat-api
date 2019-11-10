import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0,
  options: {},
  retry_strategy(options) {
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

export default client;
