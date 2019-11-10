"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Restaurant = require('../app/models/Restaurant'); var _Restaurant2 = _interopRequireDefault(_Restaurant);
var _Provider = require('../app/models/Provider'); var _Provider2 = _interopRequireDefault(_Provider);
var _File = require('../app/models/File'); var _File2 = _interopRequireDefault(_File);
var _Appointment = require('../app/models/Appointment'); var _Appointment2 = _interopRequireDefault(_Appointment);
var _Food = require('../app/models/Food'); var _Food2 = _interopRequireDefault(_Food);

_dotenv2.default.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

const models = [_User2.default, _Restaurant2.default, _Provider2.default, _File2.default, _Appointment2.default, _Food2.default];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // Connecting to the SQL database (MySQL)
  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default);

    models.map(model => model.init(this.connection));

    const associatedModels = models.filter(
      model => typeof model.associate === 'function'
    );

    associatedModels.map(model => model.associate(this.connection.models));
  }

  // Connecting to the NoSQL database (Mongo)
  mongo() {
    this.mongoConnection = _mongoose2.default.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

exports. default = new Database();
