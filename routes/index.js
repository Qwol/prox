var express = require('express');
var router = express.Router();

var getFile = require('../utils/read-file.js').str;

/* GET home page. */
router.get('/', function(req, res) {
  getFile(function (file) {
    res.end(file);
  });  
});

module.exports = router;
