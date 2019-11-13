const kue = require('kue');
const redisConfig = require('../config/redis');
const CancellationMail = require('../app/jobs/CancellationMail');

const Queue = kue.createQueue({ redis: redisConfig });

Queue.process(CancellationMail.key, CancellationMail.handle);

module.exports = Queue;
