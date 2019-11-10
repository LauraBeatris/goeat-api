"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

var _multer = require('./config/multer'); var _multer2 = _interopRequireDefault(_multer);

var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _ProviderController = require('./app/controllers/ProviderController'); var _ProviderController2 = _interopRequireDefault(_ProviderController);
var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);
var _FileController = require('./app/controllers/FileController'); var _FileController2 = _interopRequireDefault(_FileController);
var _RestaurantController = require('./app/controllers/RestaurantController'); var _RestaurantController2 = _interopRequireDefault(_RestaurantController);
var _FoodController = require('./app/controllers/FoodController'); var _FoodController2 = _interopRequireDefault(_FoodController);
var _AppointmentController = require('./app/controllers/AppointmentController'); var _AppointmentController2 = _interopRequireDefault(_AppointmentController);
var _ScheduleController = require('./app/controllers/ScheduleController'); var _ScheduleController2 = _interopRequireDefault(_ScheduleController);
var _NotificationsController = require('./app/controllers/NotificationsController'); var _NotificationsController2 = _interopRequireDefault(_NotificationsController);
var _DashboardController = require('./app/controllers/DashboardController'); var _DashboardController2 = _interopRequireDefault(_DashboardController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);

const routes = new (0, _express.Router)();

/* Routes */
routes.post('/users', _UserController2.default.store);
routes.post('/providers', _ProviderController2.default.store);
routes.post('/sessions', _SessionController2.default.store);

/* Starting to use the auth middleware */
routes.use(_auth2.default);

// File -> name of the field in the multipart form data
routes.post('/files/', _multer2.default, _FileController2.default.store);
routes.get('/files/', _FileController2.default.index);
routes.get('/files/:file_id', _FileController2.default.show);

routes.put('/users', _UserController2.default.update);

routes.get('/providers', _ProviderController2.default.index);

routes.post('/restaurants', _RestaurantController2.default.store);
routes.get('/restaurants', _RestaurantController2.default.index);
routes.get('/restaurants/:provider_id', _RestaurantController2.default.index);

routes.post('/foods/:restaurant_id', _FoodController2.default.store);
routes.get('/foods/:restaurant_id', _FoodController2.default.index);

routes.post('/appointments', _AppointmentController2.default.store);
routes.get('/appointments', _AppointmentController2.default.index);
routes.delete('/appointments/:appointment_id', _AppointmentController2.default.delete);

routes.get('/schedules/:restaurant_id', _ScheduleController2.default.index);

routes.get('/notifications', _NotificationsController2.default.index);
routes.put('/notifications/:notification_id', _NotificationsController2.default.update);

routes.post('/dashboard/open/:restaurant_id', _DashboardController2.default.store);
routes.delete('/dashboard/close/:restaurant_id', _DashboardController2.default.delete);

exports. default = routes;
