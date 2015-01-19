var mongoose = require('mongoose');
var db_users   = require('../config/db-connection.js').db_users;

var userSchema = mongoose.Schema({
  login: String,
  password: String,
  email: String,
  end_date: Date
});

module.exports = function (callback) {
  if (db_users.readyState === 1) callback(null, db_users.model('users', userSchema));
  else callback({message: 'No connection to the database: db_users', status: 500});
};

