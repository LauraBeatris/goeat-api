"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Mail = require('../../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle({ data }) {
    const { appointment, formatedDate } = data;
    await _Mail2.default.sendMail({
      to: `${appointment.restaurant.provider.name} <${appointment.restaurant.provider.email}>`,
      subject: 'Cancelled appointment',
      template: 'cancellation',
      context: {
        provider: appointment.restaurant.provider.name,
        restaurant: appointment.restaurant.name,
        user: appointment.user.name,
        date: formatedDate,
      },
    });
  }
}

exports. default = new CancellationMail();
