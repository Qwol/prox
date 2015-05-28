var row = require('../models/user');
var writeSecret = require('./write-secret');

module.exports = function (callback) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.update({end_date: {$lt: Date.now()}, status: {'$ne': 3}}, {status: 3}, { multi: true }, function (err, num) {
        if (err) callback(err);
        else {
          writeSecret(function (err) {
            if (err) callback(err);
            else {
              callback(null, num);
            }
          });
        }
      });
    }
  });
};