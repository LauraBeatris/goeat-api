const { Router } = require('express');

const multerUpload = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const ProviderController = require('./app/controllers/ProviderController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const RestaurantController = require('./app/controllers/RestaurantController');
const FoodController = require('./app/controllers/FoodController');
const OrderController = require('./app/controllers/OrderController');
const ScheduleController = require('./app/controllers/ScheduleController');
const NotificationsController = require('./app/controllers/NotificationsController');
const DashboardController = require('./app/controllers/DashboardController');

const AuthMiddleware = require('./app/middlewares/auth');

const routes = new Router();

/* Routes */
routes.post('/users', UserController.store);
routes.post('/providers', ProviderController.store);
routes.post('/sessions', SessionController.store);

/* Starting to use the auth middleware */
routes.use(AuthMiddleware);

// File -> name of the field in the multipart form data
routes.post('/files/', multerUpload, FileController.store);
routes.get('/files/', FileController.index);
routes.get('/files/:file_id', FileController.show);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/restaurants', RestaurantController.store);
routes.get('/restaurants', RestaurantController.index);
routes.get('/restaurants/:provider_id', RestaurantController.index);

routes.post('/foods/:restaurant_id', FoodController.store);
routes.get('/foods/:restaurant_id', FoodController.index);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.delete('/orders/:order_id', OrderController.delete);

routes.get('/schedules/:restaurant_id', ScheduleController.index);

routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:notification_id', NotificationsController.update);

routes.post('/dashboard/open/:restaurant_id', DashboardController.store);
routes.delete('/dashboard/close/:restaurant_id', DashboardController.delete);

module.exports = routes;
