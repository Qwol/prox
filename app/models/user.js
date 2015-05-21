var mongoose = require('mongoose');
var connection   = require('../config/db-connection.js').db_users;

var userSchema = mongoose.Schema({
  _id: String,
  login: String,
  password: String,
  type: String,
  status: Number,
  end_date: Date
});

module.exports = function (callback) {
  if (connection.readyState === 1) callback(null, connection.model('users', userSchema));
  else callback({message: 'No connection to the database: db_users', status: 500});
};

