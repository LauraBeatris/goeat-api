import redis from 'redis';

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  db: 0,
  options: {},
  retry_strategy(options) {
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
};

const redisClient = redis.createClient(redisOptions);

redisClient.on('end', () => {
  console.log('REDIS connection has been closed');
});
redisClient.on('error', err => {
  console.log('REDIS client %o', err);
});

export default redisClient;
