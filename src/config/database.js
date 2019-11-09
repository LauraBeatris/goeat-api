const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

module.exports = {
  dialect: 'mysql',
  host: process.env.RDS_HOST,
  database: process.env.RDS_DATABASE,
  username: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
