var row = require('../models/user');

module.exports = function (rows, callback) {
  var condition = rows? {status: {$gte: 1}, _id: {$in: rows}}: {status: {$gte: 1}};
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.update(condition, { status: 0}, { multi: true }, function (err, numberAffected, raw) {            
        if (err) return callback(err);         
        else callback();
      });
    }
  });
};
