import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

/* Routes */
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/* Starting to use the auth middleware */
routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

export default routes;
