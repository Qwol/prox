var config = require('../config.json');

var port = config.PORT? config.PORT: 80;
var db_accounts = config.MONGODB_MAIN? 'mongodb://' + config.MONGODB_MAIN: undefined;
var file_path = config.FILE? config.FILE: undefined;

module.exports = { 
  port: port,
  db_accounts: db_accounts, 
  file_path: file_path 
};
