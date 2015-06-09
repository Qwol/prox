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
            var secret_str = '';
            var user_str = '';
            rows.forEach(function (item, index) {
              secret_str += item.login + '\t';
              secret_str += 'pptpd\t';              
              secret_str += item.password + '\t';
              secret_str += item._id + '\n';
              if (item.type != 's') user_str += item.login + ':CL:' + item.password + '\n';
              // if (index < (rows.length - 1)) {
              //   secret_str += '\n';
              //   user_str += '\n';
              // }
            });
            fs.writeFile(config.secrets_path, secret_str, function (err) {
              if (err) callback(err);
              else fs.writeFile(config.user_path, user_str, function (err) {
                if (err) callback(err);
                else callback();
              });
            });
          }
        });
      }
    });
  } else {
    callback(new Error('file path is undefined'));
  }
};