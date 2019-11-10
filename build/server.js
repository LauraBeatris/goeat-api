"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

_app2.default.listen(3333);

/*
  Creating the server in two files.

  -> app.js -> Initialize the express server, the middlewares and the routes.
  -> server.js -> Import the app and listen to a specific port.
*/
