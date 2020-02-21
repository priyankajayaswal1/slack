require('dotenv').config();
const os = require('os');

module.exports = {
  development: {
    uri:'postgres://postgres:postgres@127.0.0.1:5432/slack_dev',
    database: 'slack_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    username:"postgres",
    password:"postgres"
  },
  test: {
    uri:'postgres://postgres:postgres@127.0.0.1:5432/slack_test',
    database: 'slack_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    username:"postgres",
    password:"postgres"
    // username: process.env.DB_USERNAME_TEST || os.userInfo().username,
  },
  production: {
    use_env_variable: 'postgres://postgres:postgres@127.0.0.1:5432/slack_dev' || 'DATABASE_URL',
    disable_sql_logging: false,
    operatorsAliases: false,
    ssl: true,
    username:"postgres",
    password:"postgres",
    dialectOptions: {
      ssl: true,
    },
  },
};