var config = require('../../config.json');

var port = config.PORT? config.PORT: 80;
var db_users = config.MONGODB_USERS? 'mongodb://' + config.MONGODB_USERS: undefined;
console.log(config.MONGODB_USERS);
var file1_path = config.FILE1? config.FILE1: undefined;
var file2_path = config.FILE2? config.FILE2: undefined;

module.exports = { 
  port: port,
  db_users: db_users, 
  secrets_path: file1_path,
  shaper_path: file2_path
};
