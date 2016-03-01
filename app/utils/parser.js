var fs = require('fs');
var moment = require('moment');

function parseLine (arr) {  
  var line = {
    _id: arr[3],
    login: arr[0],
    password: arr[2]
    // type: String,          
  }

  if (arr[4] === '#xxxx-xx-xx') {
    line.end_date = null;
    line.status = 1;
  } else {
    var time_str = arr[4].substr(1);
    line.end_date = moment(time_str).valueOf();
    line.status = moment(time_str).isAfter()? 2: 3;
  }   
       
  switch (arr[3].split(".")[0]) {
    case '20':
      line.type = 'a';
      break;
    case '1':
      line.type = 's';
      break;
    case '3':
      line.type = 'm';
      break;
    case '5':
      line.type = 'l';
      break;
    case '10':
      line.type = 'xl';
      break;                                                
    default: line.type = 't';
  }

  return line;
}


module.exports = function (path, callback) {

  var remaining = '';
  var result = [];

  var input = fs.createReadStream(path);

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var arr = remaining.substring(0, index).split("\t");
      console.log(arr);
      remaining = remaining.substring(index + 1);
      if (arr.length === 5) result.push(parseLine(arr));
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      var arr = remaining.split("\t");
      if (arr.length === 5) result.push(parseLine(arr));
    }
    callback(null, result);
  });

  input.on('error', function(err) {
    callback(err);
  });
};