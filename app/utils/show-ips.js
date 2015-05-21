var row = require('../models/user');

module.exports = function (type, callback) {
  var conditions = type? {status: 0}: {status: 0, type: type};
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.find(conditions, {ip: true},function (err, rows) {
        if (err) callback(err);
        else callback(null, rows);
      });
    }
  });
};