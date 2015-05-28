var fs = require('fs');
var row = require('../models/user');
var config = require('../config/app-config.js')

module.exports = function (callback) {
  if (config.secrets_path) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.find({status: { $gt: 0, $lt: 3}}, function (err, rows) {
          if (err) callback(err);
          else {                           
            var str = '';
            rows.forEach(function (item, index) {
              str += item.login + '\t';
              str += 'pptpd\t';              
              str += item.password + '\t';
              str += item._id;
              if (index < (rows.length - 1)) str += '\n';
            });
            fs.writeFile(config.secrets_path, str, function (err) {
              if (err) callback(err);
              else callback();
            });
          }
        });
      }
    });
  } else {
    callback(new Error('file path is undefined'));
  }
};