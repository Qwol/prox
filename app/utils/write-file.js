var fs = require('fs');
var row = require('../models/user');
var config = require('../config/app-config.js')

module.exports.obj = function (callback) {
  if (config.file_path) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.find({status: { $gte: 1}}, function (err, rows) {
          if (err) callback(err);
          else {                           
            try {
              fs.writeFileSync(config.file_path, data);
            } catch (ex) {
              callback(ex);
              return undefined;
            }
            callback();
          }
        });
      }
    });
  } else {
    callback(new Error('file path is undefined'));
  }
};