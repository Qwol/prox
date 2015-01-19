var mongoose  = require('mongoose');
var config    = require('./app-config.js');


var connectWithRetry = function(connection, url) {
    console.log(url);
  return connection.open(url, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup: ' + url);
      console.error('Retrying in 30 sec', err);
      setTimeout(connectWithRetry.bind(null, connection, url), config.retry_connection_time);
    }
  });
};

// db_users connection
console.log('start db_users connection: ' + config.db_users);
var db_users = mongoose.createConnection();

connectWithRetry(db_users, config.main_db);

db_users.on('open', function (ref) {
    console.log('open connection to mongo server: db_users');
});

db_users.on('connected', function (ref) {
    console.log('connected to mongo server: db_users');
});

db_users.on('disconnected', function (ref) {
    console.log('disconnected from mongo server: db_users');
});

db_users.on('close', function (ref) {
    console.log('close connection to mongo server: db_users');
});

db_users.on('error', function (err) {
    console.log('error connection to mongo server: db_users');
    console.log(err);
});

db_users.db.on('reconnect', function (ref) {
    console.log('reconnect to mongo server: db_users');
});

exports.db_users = db_users;
