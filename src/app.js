import express from 'express';
import dotenv from 'dotenv';
import { resolve } from 'path';
import routes from './routes';

import './database';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
});

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    this.middlewares();
    this.routes();
  }

  middlewares() {
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
  }
}

export default new App().server;
