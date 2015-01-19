var config = require('../config.json');

var port = config.PORT? config.PORT: 80;
var db_users = config.MONGODB_USERS? 'mongodb://' + config.MONGODB_USERS: undefined;
var file_path = config.FILE? config.FILE: undefined;

module.exports = { 
  port: port,
  db_users: db_users, 
  file_path: file_path 
};
