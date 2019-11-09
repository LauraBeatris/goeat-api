const redisConfig = {
  host: process.env.REDIS_HOST,
};

if (process.env.NODE_ENV === 'development')
  redisConfig.port = process.env.REDIS_PORT;

export default redisConfig;
