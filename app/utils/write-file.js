var fs = require('fs');
var row = require('../models/user');
var config = require('../config/app-config.js')

module.exports = function (callback) {
  if (config.file_path) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.find({status: { $gte: 1}}, function (err, rows) {
          if (err) callback(err);
          else {                           
            var str = '';
            rows.forEach(function (item) {
              str += item.login + '\t';
              str += 'pptpd\t';              
              str += item.password + '\t';
              str += item.ip + '\n';
            });
            try {
              fs.writeFileSync(config.file_path, str);
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