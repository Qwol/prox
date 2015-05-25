var row = require('../models/user');

function validation (data) {
  // var data = {
  //   login: login,
  //   password: password,
  //   ip: ip,
  //   type: type,
  //   exist: exist
  // };
  var type = data.type;
  if (!type) return "Тип записи не указан!";
  if (!(/\d{10}/).test(login.substr(-10, 10))) return "Некорректный логин!";  
  if (!(/[a-z0-9_]{10}/).test(password)) return "Некорректный пароль!";
  if (!(/[a-z0-9_]{10}/).test(password)) return "Некорректный пароль!";   
  if (login.substr(0, str.length - 10) !== type) return "IP адрес не соответствует выбранному типу учетной записи!";
}

module.exports = function (new_row, callback) {

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