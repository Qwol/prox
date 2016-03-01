var row = require('../models/user');
var parser = require('./parser');

module.exports = function (path, callback) {
  parser(path , function (err, result) {
    if (err) callback(err);
    else {
      row(function (err, model) {        
        if (err) callback(err);
        else {
          console.log(result);
          model.create(result, function (err, docs) {
            if (err) callback(err);
            else callback();
          });
        }
      });
    }    
  });
};