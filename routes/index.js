var express = require('express');
var router = express.Router();

var getFileStr = require('../utils/read-file.js').str;
var getFileObj = require('../utils/read-file.js').obj;

/* GET home page. */
router.get('/', function(req, res) {
  getFileObj(function (file) {
    res.send(file);
  });  
});

module.exports = router;
