var express = require('express');
var router = express.Router();
var add_row = require('../utils/add-row');
var edit_row = require('../utils/edit-row');
var edit_rows = require('../utils/edit-rows');
var remove_row = require('../utils/remove-row');
// var write_file = require('../utils/write-file');
// var switch_on = require('../utils/switch-on');
// var switch_off = require('../utils/switch-off');
var show_rows = require('../utils/show-rows');
var show_ips = require('../utils/show-ips');
var import_rows = require('../utils/import');
var moment = require('moment');

//init
router.get('/', function(req, res) {
  res.render('pages/index');       
});

//show all rows
router.get('/rows', function(req, res, next) {  
  show_rows(req.query.all,function (err, rows) {
    if (err) next(err);
    else {
      res.send(rows);
    }
  });
});

//show free ips
router.get('/freeip', function(req, res, next) {  
  show_ips(req.query.type,function (err, rows) {
    if (err) next(err);
    else {
      res.send(rows);
    }
  });
});

//add add row
router.post('/rows', function(req, res, next) {
  add_row(req.body, function (err, saved_data) {
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});

//remove rows
router.delete('/rows', function(req, res, next) { 
  remove_row(req.body, function (err) {
    if (err) next(err);
    else {      
      res.status(200).end();
    }
  });
});

//edit row
router.put('/row', function(req, res, next) {
  edit_row(req.body, function (err, saved_data) {
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});

//edit rows
router.put('/rows', function(req, res, next) {
  edit_rows(req.body, function (err) {
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});

//import
router.get('/import', function(req, res, next) {
  var path = req.query.path;
  console.log(path);
  import_rows(path, function (err) {
    if (err) next(err);
    else {
      res.status(200).end();
    } 
  });
});
module.exports = router;