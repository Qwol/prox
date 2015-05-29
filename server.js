var app = require('./app/app');
var checker = require('./app/utils/check-date');
var period = require('./app/config/app-config').period;

var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + server.address().port);
  setInterval(function () {
    checker(function (err, msg) {
      if (err) console.log(err);
      else if (msg) console.log('Срок действия аккаунта истек: ' + msg);
    });
  }, period);  
});
