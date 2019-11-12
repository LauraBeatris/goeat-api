const kue = require('kue');
const Sentry = require('@sentry/node');
const redisConfig = require('../config/redis');

const CancellationMail = require('../app/jobs/CancellationMail');

const jobs = [CancellationMail];

class Queue {
  constructor() {
    // Creating queue instance
    this.queue = kue.createQueue({ redis: redisConfig });

    // Starting queues
    this.processQueue();
  }

  // Processing each queue passing the unique key and the handle of the job
  processQueue() {
    jobs.forEach(job => this.queue.process(job.key, job.handle));

    // Verifying if sentry is in the app
    if (Sentry) {
      this.queue.on('error', Sentry.captureException);
    }
  }
}

module.exports = new Queue();
