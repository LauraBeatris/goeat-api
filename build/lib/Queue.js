"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _kue = require('kue'); var _kue2 = _interopRequireDefault(_kue);
var _node = require('@sentry/node'); var _node2 = _interopRequireDefault(_node);
var _redis = require('../config/redis'); var _redis2 = _interopRequireDefault(_redis);

var _CancellationMail = require('../app/jobs/CancellationMail'); var _CancellationMail2 = _interopRequireDefault(_CancellationMail);

const jobs = [_CancellationMail2.default];

class Queue {
  constructor() {
    // Creating queue instance
    this.queue = _kue2.default.createQueue({ redis: _redis2.default });

    // Starting queues
    this.processQueue();
  }

  // Processing each queue passing the unique key and the handle of the job
  processQueue() {
    jobs.forEach(job => this.queue.process(job.key, job.handle));

    if (_node2.default) {
      this.queue.on('error', _node2.default.captureException);
    }
  }
}

exports. default = new Queue().queue;
