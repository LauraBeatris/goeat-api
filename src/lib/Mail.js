import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import sesTransport from 'nodemailer-ses-transport';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // const { host, port, auth } = mailConfig;

    // Connecting to an external mail service
    this.transporter = nodemailer.createTransport(
      sesTransport({
        accessKeyId: process.env.MAIL_USER,
        secretAccessKey: process.env.MAIL_PASS,
      })
    );

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
    return this.transporter.sendMail(
      {
        ...mailConfig.default,
        ...message,
      },
      (err, info) => {
        if (err) return console.log(err);

        return console.log(info);
      }
    );
  }
}

export default new Mail();
