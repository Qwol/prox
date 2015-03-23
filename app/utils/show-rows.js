var row = require('../models/user');

module.exports = function (callback) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.find(function (err, rows) {
        if (err) callback(err);
        else callback(null, rows);
      });
    }
  });
};