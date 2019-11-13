const Mail = require('../../lib/Mail');

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle({ data }) {
    const { appointment, formatedDate } = data;
    await Mail.sendMail({
      to: `<${appointment.restaurant.restaurant.email}>`,
      subject: 'Cancelled appointment',
      template: 'cancellation',
      context: {
        provider: appointment.restaurant.restaurant.name,
        restaurant: appointment.restaurant.name,
        user: appointment.user.name,
        date: formatedDate,
      },
    });
  }
}

module.exports = new CancellationMail();
