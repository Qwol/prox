var LocalStrategy = require('passport-local').Strategy
  , row = require('../models/user');

module.exports = new LocalStrategy(
  function(username, password, done) {
    row(function (err, model) {
      if (err) callback(err);
      else {
        model.findOne({ login: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Неверное имя пользователя.' });
          }
          if (user.password != password) {
            return done(null, false, { message: 'Неверный пароль.' });
          }
          return done(null, user);
        });  
      }
    });
  }
);