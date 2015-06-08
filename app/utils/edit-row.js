var row = require('../models/user');
var writeSecret = require('./write-secret');

function validation (data) {
  // var data = {
  //   login: login,
  //   password: password,
  //   ip: ip,
  //   type: type,
  //   exist: exist
  // };
  var login = data.login;
  var password = data.password;
  var ip = data.ip;
  var type = data.type;
  var status = parseInt(data.status);
  switch (status) {
    case 0:
      data.login = null;
      data.password = null;
      data.end_date = null;
      break;
    case 1:
      if (type !== 'a' && !(/\d{10}/).test(login.substr(-10, 10))) return "Некорректный логин!";  
      if (type !== 'a' && !(/[a-z0-9]{10}/).test(password)) return "Некорректный пароль!";
      if (type !== 'a' && login.substr(0, login.length - 10) !== type) return "Логин не соответствует выбранному типу учетной записи!";
      data.end_date = null;
      break;
    case 2:
      if (type !== 'a' && !(/\d{10}/).test(login.substr(-10, 10))) return "Некорректный логин!";  
      if (type !== 'a' && !(/[a-z0-9]{10}/).test(password)) return "Некорректный пароль!";
      if (type !== 'a' && login.substr(0, login.length - 10) !== type) return "Логин не соответствует выбранному типу учетной записи!";
      console.log(data.end_date);
      console.log(Date.now());
      // if (data.end_date < Date.now()) return "Некорректная дата завершения работы учетной записи!"
      break;
    case 3:
      break;
  }  
}

module.exports = function (data, callback) {
  var valid = validation(data);
  if (valid) callback(new Error(valid));
  else {
    if (data.status < 2) {
      data.end_date = null; 
    } 
    if (data.status == 0) {
      data.login = null;
      data.password = null;
    }

    row(function (err, model) {
      if (err) callback(err);
      else {               
        var doc = {};
        if (data.status == 3) doc = {status: data.status};
        else if (data.status == 0) doc = {
          $unset: { login: ""},
          password: data.password,
          status: data.status,
          end_date: data.end_date
        };
        else doc = {
          login: data.login,
          password: data.password,
          status: data.status,
          end_date: data.end_date
        };
        model.update({_id: data.ip}, doc, function (err, saved_data) {
          if (err) callback(err);
          else {
            writeSecret(function (err) {
              if (err) callback(err);
              else {
                callback(null, saved_data);
              }
            });
          }
        });      
      }
    });
  }
};