var mongoose = require('mongoose');
var row = require('../models/user');

module.exports = function (edited_row, callback) {
            console.log(edited_row);
              //   login: $(login).val(),
              // password: $(password).val(),
              // ip: $(ip).val(),
              // status: status,
              // end_date: end_
  // var regex = new RegExp('^\\w+'+myStr+'\\w+$','i');
  if (edited_row && edited_row._id) {
    if (edited_row.status != 2) {
      console.log('not active');
      edited_row.end_date = null; 
    }
    row(function (err, model) {
      if (err) callback(err);
      else {
        if (typeof(edited_row._id) == "object" ) {
          var objectIdsArray = [];
          for (i=0; i < edited_row._id.length; i++) {
            objectIdsArray.push(mongoose.Types.ObjectId(edited_row._id[i]));
          }
          model.update({_id: {$in: objectIdsArray}}, {status: edited_row.status, end_date: edited_row.end_date}, { multi: true }, function (err, saved_row) {
            if (err) callback(err);
            else callback(null, saved_row);
          });
        } else if (typeof(edited_row._id) == "string" ) {
          model.update({_id: edited_row._id}, edited_row, function (err, saved_row) {
            if (err) callback(err);
            else callback(null, saved_row);
          });
        }
      }
    });
  }
};