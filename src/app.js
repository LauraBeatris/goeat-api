import express from 'express';
import dotenv from 'dotenv';
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
  }

  routes() {
    // Getting the router ( Responsable for the routes of the API )
    this.server.use(routes);
  }
}

export default new App().server;
