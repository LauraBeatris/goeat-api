const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const Sentry = require('@sentry/node');
const Youch = require('youch');
require('express-async-errors');
const routes = require('./routes');
const sentryConfig = require('./config/sentry');

require('./database');

dotenv.config({});

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    // Initializing Sentry
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    // Ready to receive request in json format
    this.server.use(express.json());

    // TODO -> Set address of the goeat web application
    // this.server.use(cors({origin: 'https://somename'}));
    this.server.use(cors());
  }

  routes() {
    // Getting the router ( Responsable for the routes of the API )
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    if (process.env.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    // Middleware responsable for handling

    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

module.exports = new App().server;
