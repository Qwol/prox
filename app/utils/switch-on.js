var row = require('../models/user');

module.exports = function (rows, callback) {
  var condition = rows? {status: 0, _id: {$in: rows}}: {status: 0};
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.find(condition, function (err, docs) {
        if (err) return callback(err);
        else if (docs) {
          var str = '';
          docs.forEach(function (item, index) {
            str += 'Login: ';
            str += item.login;
            str += '\t||\t';
            str += 'Password: ';
            str += item.password;        
            if (index < (docs.length - 1)) str += '\n';
          });

          model.update(condition, { status: 1}, { multi: true }, function (err, numberAffected, raw) {            
            if (err) return callback(err);
            else callback(null, str);            
          });
        } else callback(new Error('Cant finde any rows by this query'));
      });


    }
  });
};
