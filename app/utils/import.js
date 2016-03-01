var row = require('../models/user');
var parser = require('./parser');

module.exports = function (path) {
  var rows = parser(path);
};