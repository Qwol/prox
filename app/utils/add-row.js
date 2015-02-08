var row = require('../models/user');

module.exports = function (new_row, callback) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.create(new_row, function (err, saved_row) {
        if (err) callback(err);
        else callback(null, saved_row);
      });
    }
  });
};