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

// resourse_db connection
console.log('start resourse_db connection: ' + config.scene_db);
var resourse_db = mongoose.createConnection();

connectWithRetry(resourse_db, config.scene_db);

resourse_db.on('open', function (ref) {
    console.log('open connection to mongo server: resourse_db');
});

resourse_db.on('connected', function (ref) {
    console.log('connected to mongo server: resourse_db');
});

resourse_db.on('disconnected', function (ref) {
    console.log('disconnected from mongo server: resourse_db');
});

resourse_db.on('close', function (ref) {
    console.log('close connection to mongo server: resourse_db');
});

resourse_db.on('error', function (err) {
    console.error('error connection to mongo server: resourse_db');
    console.error(err);
});

resourse_db.db.on('reconnect', function (ref) {
    console.log('reconnect to mongo server: resourse_db');
});

// user_db connection
console.log('start user_db connection: ' + config.main_db);
var user_db = mongoose.createConnection();

connectWithRetry(user_db, config.main_db);

user_db.on('open', function (ref) {
    console.log('open connection to mongo server: user_db');
});

user_db.on('connected', function (ref) {
    console.log('connected to mongo server: user_db');
});

user_db.on('disconnected', function (ref) {
    console.log('disconnected from mongo server: user_db');
});

user_db.on('close', function (ref) {
    console.log('close connection to mongo server: user_db');
});

user_db.on('error', function (err) {
    console.log('error connection to mongo server: user_db');
    console.log(err);
});

user_db.db.on('reconnect', function (ref) {
    console.log('reconnect to mongo server: user_db');
});

// map_db connection
console.log('start map_db connection: ' + config.map_db);
var map_db = mongoose.createConnection();

connectWithRetry(map_db, config.map_db);

map_db.on('open', function (ref) {
    console.log('open connection to mongo server: map_db');
});

map_db.on('connected', function (ref) {
    console.log('connected to mongo server: map_db');
});

map_db.on('disconnected', function (ref) {
    console.log('disconnected from mongo server: map_db');
});

map_db.on('close', function (ref) {
    console.log('close connection to mongo server: map_db');
});

map_db.on('error', function (err) {
    console.log('error connection to mongo server: map_db');
    console.log(err);
});

map_db.db.on('reconnect', function (ref) {
    console.log('reconnect to mongo server: map_db');
});


// product_db connection
console.log('start product_db connection: ' + config.product_db);
var product_db = mongoose.createConnection();

connectWithRetry(product_db, config.product_db);

product_db.on('open', function (ref) {
    console.log('open connection to mongo server: product_db');
});

product_db.on('connected', function (ref) {
    console.log('connected to mongo server: product_db');
});

product_db.on('disconnected', function (ref) {
    console.log('disconnected from mongo server: product_db');
});

product_db.on('close', function (ref) {
    console.log('close connection to mongo server: product_db');
});

product_db.on('error', function (err) {
    console.log('error connection to mongo server: product_db');
    console.log(err);
});

product_db.db.on('reconnect', function (ref) {
    console.log('reconnect to mongo server: product_db');
});

exports.user_db = user_db;
exports.resourse_db = resourse_db;
exports.map_db = map_db;
exports.product_db = product_db;