var row = require('../models/user');

module.exports = function (type, callback) {
  console.log(type);
  var conditions = type? {status: 0, type: type}: {status: 0};
  console.log(conditions);
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.findOne(conditions, {},function (err, row) {
        console.log(row);
        if (err) callback(err);        
        else callback(null, row);        
      });
    }
  });
};