var express = require('express');
var router = express.Router();
var add_row = require('./utils/add-row');
var write_file = require('./utils/write-file');

//add new row
router.post('/row', function(req, res, next) {
  add_row(req.body, function (err, saved_data) {
    if (err) next(err);
    else {
      res.send(saved_data);
    }
  });
});

//write active rows to file
router.copy('/row', function(req, res, next) {
  write_file(function (err) {
    if (err) next(err);
    else {
      res.end('Ok!');
    }
  });
});

module.exports = router;