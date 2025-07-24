require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'bayambook_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  timezone: '+05:45', // Nepal timezone
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};