var row = require('../models/user');

module.exports = function (rows, callback) {
  var condition = rows? {status: 0, _id: {$in: rows}}: {status: 0};
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.update(condition, { status: 1}, { multi: true }, function (err, numberAffected) {
        if (err) return callback(err);
        else callback(null, numberAffected);
      });
    }
  });
};