import 'dotenv/config';

import express from 'express';
import dotenv from 'dotenv';
import { resolve } from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

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

    // Ready to access static files
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // Getting the router ( Responsable for the routes of the API )
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
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

export default new App().server;
