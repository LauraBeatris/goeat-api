import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ msg: "Hello, I'm a developer" });
});

export default routes;
