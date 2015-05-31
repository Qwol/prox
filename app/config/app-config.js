var config = require('../../config.json');

var port = config.PORT? config.PORT: 80;
var db_users = config.MONGODB_USERS? 'mongodb://' + config.MONGODB_USERS: undefined;
var email = config.EMAIL? config.EMAIL: undefined;
var secrets_path = config.FILE_SECRET? config.FILE_SECRET: undefined;
var shaper_path = config.FILE_SHAPER? config.FILE_SHAPER: undefined;
var user_path = config.FILE_USER? config.FILE_USER: undefined;
var period = config.PERIOD? config.PERIOD: 600000;

module.exports = { 
  port: port,
  period: period,
  db_users: db_users,
  email: email, 
  secrets_path: secrets_path,
  shaper_path: shaper_path,
  user_path: user_path
};
