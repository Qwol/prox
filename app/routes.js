var express = require('express');
var router = express.Router();
var add_row = require('./utils/add-row');

router.post('/row', function(req, res, next) {
  // var data = JSON.parse(req.body);
  add_row(req.body, function (err, saved_data) {
    if (err) next(err);
    else {
      res.send(saved_data);
    }
  });
});

module.exports = router;