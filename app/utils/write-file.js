var fs = require('fs');
var path = require('path');
var config = require('../config/app-config.js')

module.exports.obj = function (callback) {
  if (config.file_path) {
      var str = fs.readFileSync(config.file_path, {encoding: 'utf-8'});
        
      var arr = str.split('\n');
      if (!arr[arr.length-1]) arr.pop();
      var obj = {
        rows : []
      };
      
      arr.forEach(function (item) {
        var row = item.split('\t');
        var activ = true;
        if (row[0][0] === '#') {
          activ = false;
          row[0] = row[0].substr(1);
        }
        row[4] = row[4].substr(1);
        var activ = (row[0][0] === '#')? false: true;
        obj.rows.push({
          activ: activ,
          login: row[0],
          token: row[2],
          ip: row[3],
          date: new Date(row[4])
        });
      });
      callback(obj);
    } else {
      console.log('file path is undefined');
  }
};