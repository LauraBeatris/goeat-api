function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  const newObj = {};
  if (obj != null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  return newObj;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
Object.defineProperty(exports, '__esModule', { value: true });
const _express = require('express');

const _express2 = _interopRequireDefault(_express);
const _dotenv = require('dotenv');

const _dotenv2 = _interopRequireDefault(_dotenv);
const _path = require('path');
const _node = require('@sentry/node');

const Sentry = _interopRequireWildcard(_node);
const _youch = require('youch');

const _youch2 = _interopRequireDefault(_youch);
require('express-async-errors');
const _routes = require('./routes');

const _routes2 = _interopRequireDefault(_routes);
const _sentry = require('./config/sentry');

const _sentry2 = _interopRequireDefault(_sentry);

require('./database');

_dotenv2.default.config({});

class App {
  constructor() {
    this.server = _express2.default.call(void 0);
    this.isDev = process.env.NODE_ENV !== 'production';

    // Initializing Sentry
    Sentry.init(_sentry2.default);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    // Ready to receive request in json format
    this.server.use(_express2.default.json());

    // Ready to access static files
    this.server.use(
      '/files',
      _express2.default.static(
        _path.resolve.call(void 0, __dirname, '..', 'tmp', 'uploads')
      )
    );
  }

  routes() {
    // Getting the router ( Responsable for the routes of the API )
    this.server.use(_routes2.default);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // Middleware responsable for handling

    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const errors = await new (0, _youch2.default)(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

exports.default = new App().server;
