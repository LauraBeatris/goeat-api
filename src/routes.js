import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RestaurantController from './app/controllers/RestaurantController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import FoodController from './app/controllers/FoodController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/* Routes */
routes.post('/users', UserController.store);
routes.post('/providers', ProviderController.store);
routes.post('/sessions', SessionController.store);

/* Starting to use the auth middleware */
routes.use(AuthMiddleware);

// File -> name of the field in the multipart form data
routes.post('/files/', upload.single('file'), FileController.store);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/restaurants', RestaurantController.store);
routes.get('/restaurants', RestaurantController.index);
routes.get('/restaurants/:provider_id', RestaurantController.index);

routes.post('/foods/:restaurant_id', FoodController.store);
routes.get('/foods/:restaurant_id', FoodController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);

routes.get('/schedules', ScheduleController.index);

export default routes;
