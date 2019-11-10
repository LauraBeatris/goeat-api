"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _beequeue = require('beequeue'); var _beequeue2 = _interopRequireDefault(_beequeue);
var _CancellationMail = require('../app/jobs/CancellationMail'); var _CancellationMail2 = _interopRequireDefault(_CancellationMail);
var _redis = require('../config/redis'); var _redis2 = _interopRequireDefault(_redis);

const jobs = [_CancellationMail2.default];

class Queue {
  constructor() {
    // Each queue of a specific background job
    this.queues = {};

    // Starting queues
    this.init();
  }

  init() {
    // Iterating per jobs and storaging the queues with a unique key and the handle for the tasks
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new (0, _beequeue2.default)(key, {
          redis: _redis2.default,
        }),
        handle,
      };
    });
  }

  add(queue, jobData) {
    // Passing the job data for the specific queue
    // Putting the new task in the queue
    return this.queues[queue].bee.createJob(jobData).save();
  }

  processQueue() {
    jobs.forEach(job => {
      // Accessing the bee queue and the handle method
      const { bee, handle } = this.queues[job.key];

      // Processing the tasks
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

exports. default = new Queue();
