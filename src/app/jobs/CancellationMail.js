import Mail from '../../lib/Mail';

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle(key, { appointment, formatedDate }) {
    await Mail.sendMail(
      {
        to: `${appointment.restaurant.restaurant.name} <${appointment.restaurant.restaurant.email}>`,
        subject: 'Cancelled appointment',
        template: 'cancellation',
        context: {
          provider: appointment.restaurant.restaurant.name,
          restaurant: appointment.restaurant.name,
          user: appointment.user.name,
          date: formatedDate,
        },
      },
      (error, result) => {
        if (error) return console.error('error', error);
        return console.log('error', result);
      }
    );
  }
}

export default new CancellationMail();
