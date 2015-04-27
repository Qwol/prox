var row = require('../models/user');

module.exports = function (edited_row, callback) {
              //   login: $(login).val(),
              // password: $(password).val(),
              // ip: $(ip).val(),
              // status: status,
              // end_date: end_
  // var regex = new RegExp('^\\w+'+myStr+'\\w+$','i');
  if (edited_row && edited_row.login) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.update({_id: edited_row._id}, edited_row, function (err, saved_row) {
          if (err) callback(err);
          else callback(null, saved_row);
        });
      }
    });
  }
};