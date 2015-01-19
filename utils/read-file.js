var fs = require('fs');
var path = require('path');
var config = require('../config/app-config.js')

module.exports.str = function (callback) {
  if (config.file_path) {
    var str = fs.readFileSync(config.file_path, {encoding: 'utf-8'});
      
    callback(str);
  } else {
    console.log('file path is undefined');
  }
};

module.exports.obj = function (callback) {
  if (config.file_path) {
      var str = fs.readFileSync(config.file_path, {encoding: 'utf-8'});
        
      var arr = str.split('\n');
      if (!arr[arr.length-1]) arr.pop();

      console.log(arr);
      callback(obj);
    } else {
      console.log('file path is undefined');
  }
};