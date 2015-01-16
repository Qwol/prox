var fs = require('fs');
var path = require('path');
var config = require('../config/app-config.js')

module.exports = function (callback) {
  if (config.file_path) {
    var file = fs.readFileSync(config.file_path, {encoding: 'utf-8'});
      
    var arr = file.split('\n');
    if (!arr[arr.length-1]) arr.pop();

    console.log(arr);
    callback(file);
  } else {
    console.log('file path is undefined');
  }
};