var fs = require('fs');
var row = require('../models/user');
var config = require('../config/app-config.js')

var speed = {
  a: '10Mbit',
  m: '3Mbit',
  l: '5Mbit',
  xl: '10Mbit',
  t: '10Mbit'
};

module.exports = function (callback) {
  if (config.secrets_path) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.find({type: {$ne: 's'}},function (err, rows) {
          if (err) callback(err);
          else {                           
            var str = '';
            rows.forEach(function (item, index) {
              str += item._id +':' + speed[item.type];
              if (index < (rows.length - 1)) str += '\n';
            });
            fs.writeFile(config.shaper_path, str, function (err) {
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