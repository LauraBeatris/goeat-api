import Mail from '../../lib/Mail';

class CancellationMail {
  // Unique Key
  get key() {
    return 'CancellationMail';
  }

  // Run this for each task of the job
  async handle({ data }) {
    const { appointment, formatedDate } = data;
    await Mail.sendMail({
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

export default new CancellationMail();