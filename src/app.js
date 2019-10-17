const express = require("express");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();
    this.isDev = process.env.NODE_ENV !== "production";

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

module.exports = new App().server;
