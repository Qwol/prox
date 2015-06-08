var row = require('../models/user');
var writeSecret = require('./write-secret');

module.exports = function (data, callback) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.update({_id: {$in: data.id}}, {
        $unset: { login: ""},
        password: null,
        status: 0,
        end_date: null
      }, { multi: true }, function (err) {
        if (err) callback(err);
        else {          
          writeSecret(function (err) {
            if (err) callback(err);
            else {
              callback(null);
            }
          }); 
        }
      });
    }
  });
};

