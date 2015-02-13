var express = require('express');
var router = express.Router();
var add_row = require('./utils/add-row');
var write_file = require('./utils/write-file');
var switch_on = require('./utils/switch-on');
var switch_off = require('./utils/switch-off');
var moment = require('moment');

//add new row
router.post('/rows', function(req, res, next) {
  add_row(req.body, function (err, saved_data) {
    console.log(saved_data);
    if (err) next(err);
    else {
      res.send(saved_data);
    }
  });
});

//write active rows to file
router.copy('/rows', function(req, res, next) {
  write_file(function (err) {
    if (err) next(err);
    else {
      res.end({saved: true});
    }
  });
});

//switch on inactive rows
router.post('/rows/switchon', function(req, res, next) {
  var rows = req.body.rows? req.body.rows: undefined;
  switch_on(rows, function (err, string) {
    if (err) next(err);
    else {
      res.set({"Content-Disposition":"attachment; filename=\"Hello.txt\""});      
      res.send(string);
    }
  });
});

//switch on inactive rows
router.get('/rows/switchon', function(req, res, next) {
  // var rows = req.body.rows? req.body.rows: undefined;
  switch_on(undefined, function (err, string) {
    if (err) next(err);
    else {
      res.set({"Content-Disposition":"attachment; filename=\"" + moment().format() +".csv\""});      
      res.send(string);
    }
  });
});

router.get('/rows/switchoff', function(req, res, next) {
  // var rows = req.body.rows? req.body.rows: undefined;
  switch_off(undefined, function (err, string) {
    if (err) next(err);
    else {      
      res.end('OK');
    }
  });
});

module.exports = router;