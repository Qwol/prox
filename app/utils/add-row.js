var row = require('../models/user');

module.exports = function (new_row, callback) {
              //   login: $(login).val(),
              // password: $(password).val(),
              // ip: $(ip).val(),
              // status: status,
              // end_date: end_
  // var regex = new RegExp('^\\w+'+myStr+'\\w+$','i');
  if (new_row && new_row.login) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.create(new_row, function (err, saved_row) {
          if (err) callback(err);
          else callback(null, saved_row);
        });
      }
    });
  }
};