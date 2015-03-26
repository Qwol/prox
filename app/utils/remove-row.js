var row = require('../models/user');

module.exports = function (removing_row, callback) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.remove(removing_row, function (err) {
        if (err) callback(err);
        else callback(null, {response: 'OK'});
      });
    }
  });
};