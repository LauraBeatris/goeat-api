import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import smtpPassword from 'aws-smtp-credentials';

import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // const { host, port, auth } = mailConfig;

    // Connecting to an external mail service
    this.transporter = nodemailer.createTransport({
      port: process.env.MAIL_HOST,
      host: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.AWS_IAM_USER_KEY,
        pass: smtpPassword(process.env.AWS_IAM_USER_SECRET),
      },
      debug: true,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // Configuring the way that the message will be formatted
    this.transporter.use(
      'compile',
      // Defining the view engine configurations - Choosed: Handlebars
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
