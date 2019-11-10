"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
var _expresshandlebars = require('express-handlebars'); var _expresshandlebars2 = _interopRequireDefault(_expresshandlebars);
var _nodemailerexpresshandlebars = require('nodemailer-express-handlebars'); var _nodemailerexpresshandlebars2 = _interopRequireDefault(_nodemailerexpresshandlebars);
var _awssmtpcredentials = require('aws-smtp-credentials'); var _awssmtpcredentials2 = _interopRequireDefault(_awssmtpcredentials);

var _path = require('path');
var _mail = require('../config/mail'); var _mail2 = _interopRequireDefault(_mail);

class Mail {
  constructor() {
    // const { host, port, auth } = mailConfig;

    // Connecting to an external mail service
    this.transporter = _nodemailer2.default.createTransport({
      port: process.env.MAIL_PORT,
      host: process.env.MAIL_HOST,
      secure: true,
      auth: {
        user: process.env.AWS_IAM_USER_KEY,
        pass: _awssmtpcredentials2.default.call(void 0, process.env.AWS_IAM_USER_SECRET),
      },
      debug: true,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = _path.resolve.call(void 0, __dirname, '..', 'app', 'views', 'emails');

    // Configuring the way that the message will be formatted
    this.transporter.use(
      'compile',
      // Defining the view engine configurations - Choosed: Handlebars
      _nodemailerexpresshandlebars2.default.call(void 0, {
        viewEngine: _expresshandlebars2.default.create({
          layoutsDir: _path.resolve.call(void 0, viewPath, 'layouts'),
          partialsDir: _path.resolve.call(void 0, viewPath, 'partials'),
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
      ..._mail2.default.default,
      ...message,
    });
  }
}

exports. default = new Mail();
