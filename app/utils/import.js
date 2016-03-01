var row = require('../models/user');
var parser = require('./parser');
var writeSecret = require('./write-secret');
var writeShaper = require('./write-shaper');

module.exports = function (path, callback) {
  parser(path , function (err, result) {
    if (err) callback(err);
    else {
      row(function (err, model) {        
        if (err) callback(err);
        else {
          model.create(result, function (err, docs) {
            if (err) callback(err);
            else {
              writeShaper(function (err) {
                if (err) callback(err);
                else {
                  writeSecret(function (err) {
                    if (err) callback(err);
                    else {
                      callback();
                    }
                  });
                }
              }); 
            }
          });
        }
      });
    }    
  });
};