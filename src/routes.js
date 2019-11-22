const { Router } = require('express');

const multerUpload = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const ProviderController = require('./app/controllers/ProviderController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const RestaurantController = require('./app/controllers/RestaurantController');
const FoodController = require('./app/controllers/FoodController');
const OrderController = require('./app/controllers/OrderController');
const DeliveryController = require('./app/controllers/DeliveryController');
const ScheduleController = require('./app/controllers/ScheduleController');
const NotificationsController = require('./app/controllers/NotificationsController');
const DashboardController = require('./app/controllers/DashboardController');

const AuthMiddleware = require('./app/middlewares/auth');

const routes = new Router();

/* Entry Point */

routes.get('/', (req, res) =>
  res.send(
    "Welcome to GoEat API, to start, create a user on the '/users' route or login on the '/sessions' route. If you have some doubt, don't forget to follow the documentation https://github.com/LauraBeatris/goeat-api/blob/master/README.md"
  )
);

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

// Updating user profile
routes.put('/users', UserController.update);

// Listing all the providers
routes.get('/providers', ProviderController.index);

// Creating, listing and showing restaurants
routes.post('/restaurants', RestaurantController.store);
routes.get('/restaurants', RestaurantController.index);
routes.get('/restaurants/:provider_id', RestaurantController.index);

// Creating a food for the restaurant menu and listing all the menu of the restaurant
routes.post('/foods/:restaurant_id', FoodController.store);
routes.get('/foods/:restaurant_id', FoodController.index);

// Creating, listing and cancelling orders
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.delete('/orders/:order_id', OrderController.delete);

// Creating, updating and delivering the order
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:delivery_id', DeliveryController.update);
routes.delete('/delivery/:delivery_id', DeliveryController.delete);

// Listing all the orders of the restaurant
routes.get('/schedules/:restaurant_id', ScheduleController.index);

// Listing all the notifications of the restaurant and updating an specific notification
routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:notification_id', NotificationsController.update);

routes.post('/dashboard/open/:restaurant_id', DashboardController.store);
routes.delete('/dashboard/close/:restaurant_id', DashboardController.delete);

module.exports = routes;
