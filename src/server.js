const app = require("./app");

app.listen(3333);

/* 
  Separated the parts of the app and creating the server in two files. 

  -> app.js -> Initialize the express server, the middlewares and the routes. 
  -> server.js -> Export the app and listen to a specific port.
*/
