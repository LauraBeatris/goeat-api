const { Router } = require("express");
const routes = new Router();
// Or -> const routes = express.Router()

routes.get("/", (req, res) => {
  return res.json({ msg: "Hello, just testing here" });
});

module.exports = routes;
