var express = require('express');
var passport = require('passport');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config/app-config.js');
var local_strat = require('./config/strategy-local')

var row = require('./models/user');

var api = require('./routes/api');

var app = express();
app.set('port', config.port);
// app.use(express.compress());
// set the view engine to ejs
app.set('views', __dirname +'/views')
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public', { maxAge: 86400000 }));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({ secret: 'stop feed plz' }));
passport.use(local_strat);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  row(function (err, model) {
    if (err) callback(err);
    else {
      model.findOne({_id: id}, function(err, user) {
        done(err, user);
      });
    }
  });
});

app.use(api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (err.stack) res.send(err.stack);
        else res.send(err); 
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;