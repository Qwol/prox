var row = require('../models/user');
var writeSecret = require('./write-secret');
var writeShaper = require('./write-shaper');

function validation (data) {
  // var data = {
  //   login: login,
  //   password: password,
  //   ip: ip,
  //   type: type,
  //   exist: exist
  // };
  var type = data.type;
  var login = data.login;
  var password = data.password;
  var ip = data.ip;

  if (!type) return "Тип записи не указан!";
  if (type !== 'a' && !(/\d{10}/).test(login.substr(-10, 10))) return "Некорректный логин!";  
  if (type !== 'a' && !(/[a-z0-9]{10}/).test(password)) return "Некорректный пароль!";
  if (!(/\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}/).test(ip)) return "Некорректный IP!";   
  if (type !== 'a' && login.substr(0, login.length - 10) !== type) return "Логин не соответствует выбранному типу учетной записи!";
}

module.exports = function (data, callback) {
  var valid = validation(data);
  var exist =  JSON.parse(data.exist);
  if (valid) callback(new Error(valid));
  else {
    row(function (err, model) {
      if (err) callback(err);
      else {
        if (exist) {
          model.update({_id: data.ip}, {
            login: data.login,
            password: data.password,
            status: 1,
            end_date: null
          }, function (err, saved_row) {
            if (err) callback(err);
            else {
              writeSecret(function (err) {
                if (err) callback(err);
                else {
                  callback(null, saved_row);
                }
              });
            }
          });
        } else {
          model.create({      
            _id: data.ip,
            login: data.login,
            password: data.password,
            type: data.type,
            status: 1,
            end_date: null
          }, function (err, saved_doc) {
            if (err) callback(err);
            else {
              writeShaper(function (err) {
                if (err) callback(err);
                else {
                  writeSecret(function (err) {
                    if (err) callback(err);
                    else {
                      callback(null, saved_doc);
                    }
                  });
                }
              });             
            }
          });
        }
      }
    });
  }
};