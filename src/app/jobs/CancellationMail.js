const Mail = require('../../lib/Mail');

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle(job, done) {
    const { appointment, formatedDate } = job;

    await Mail.sendMail({
      to: `${appointment.restaurant.restaurant.name} <${appointment.restaurant.restaurant.email}>`,
      subject: 'Cancelled appointment',
      template: 'cancellation',
      context: {
        provider: appointment.restaurant.restaurant.name,
        restaurant: appointment.restaurant.name,
        user: appointment.user.name,
        date: formatedDate,
      },
    });

    return done();
  }
}

module.exports = new CancellationMail();
