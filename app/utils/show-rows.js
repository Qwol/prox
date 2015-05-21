var row = require('../models/user');

module.exports = function (isAll, callback) {
  var conditions = isAll? {}: {status:{'$ne': 0}};
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.find(conditions, {password: true, login: true, status:true, end_date: true},function (err, rows) {
        if (err) callback(err);
        else callback(null, rows);
      });
    }
  });
};