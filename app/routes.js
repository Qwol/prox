var express = require('express');
var router = express.Router();
var add_row = require('./utils/add-row');
var write_file = require('./utils/write-file');
var switch_on = require('./utils/switch-on');

//add new row
router.post('/rows', function(req, res, next) {
  add_row(req.body, function (err, saved_data) {
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
  var rows = (req.body.rows && req.body.rows.length > 0)? req.body.rows: undefined;
  switch_on(rows, function (err, count) {
    if (err) next(err);
    else {
      res.send({count: count});
    }
  });
});

module.exports = router;