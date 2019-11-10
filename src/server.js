import app from './app';

app.listen(process.env.PORT, '0.0.0.0');

/*
  Creating the server in two files.

  -> app.js -> Initialize the express server, the middlewares and the routes.
  -> server.js -> Import the app and listen to a specific port.
*/
