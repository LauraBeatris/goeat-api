const Mail = require('../../lib/Mail');

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle({ data }) {
    // TO DO -> Debug email
    const { order, formatedDate } = data
    const { restaurant, user } = order;
    console.log(user, formatedDate)
    await Mail.sendEmail({
      to: `<${restaurant.restaurant.email}>`,
      subject: 'Cancelled appointment',
      template: 'cancellation',
      context: {
        provider: restaurant.restaurant.name,
        restaurant: restaurant.restaurant.name,
        user: user.name,
        date: formatedDate,
      },
    });
  }
}

module.exports = new CancellationMail();
