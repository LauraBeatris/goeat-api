const kue = require('kue');
const Sentry = require('@sentry/node');
const redisConfig = require('../config/redis');

const CancellationMail = require('../app/jobs/CancellationMail');

const jobs = [CancellationMail];

const Queue = kue.createQueue({ redis: redisConfig });

jobs.forEach(job => {
  console.log(job.key, job.handle);
  Queue.process(job.key, job.handle);
});
Queue.on('error', Sentry.captureException);

module.exports = Queue;
