import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import RestaurantController from './app/controllers/RestaurantController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/* Routes */
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/* Starting to use the auth middleware */
routes.use(AuthMiddleware);

// File -> name of the field in the multipart form data
routes.post('/files', upload.single('file'), FileController.store);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/restaurants', RestaurantController.index);
routes.get('/restaurants/:provider_id', RestaurantController.index);

export default routes;
