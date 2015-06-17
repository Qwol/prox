var express = require('express');
var passport = require('passport');
var router = express.Router();
var add_row = require('../utils/add-row');
var edit_row = require('../utils/edit-row');
var edit_rows = require('../utils/edit-rows');
var remove_row = require('../utils/remove-row');
var show_rows = require('../utils/show-rows');
var show_ips = require('../utils/show-ips');
var moment = require('moment');

function mustAuthenticatedMw (req, res, next) {
  req.isAuthenticated()
    ? req.auth = true
    : req.auth = false;
  next();
}

function mustBeAdmin (req, res, next) {
  if (req.auth) {
    (req.user.type === 'a')
      ? next()
      : next(new Error('Permission denied'));
  } else next(new Error('Unauthorized'));
}

// //write active rows to file
// router.copy('/rows', function(req, res, next) {
//   write_file(function (err) {
//     if (err) next(err);
//     else {
//       res.end({saved: true});
//     }
//   });
// });



// //switch on inactive rows
// router.post('/rows/switchon', function(req, res, next) {
//   var rows = req.body.rows? req.body.rows: undefined;
//   switch_on(rows, function (err, string) {
//     if (err) next(err);
//     else {
//       res.set({"Content-Disposition":"attachment; filename=\"Hello.txt\""});      
//       res.send(string);
//     }
//   });
// });

// //switch on inactive rows
// router.get('/rows/switchon', function(req, res, next) {
//   // var rows = req.body.rows? req.body.rows: undefined;
//   switch_on(undefined, function (err, string) {
//     if (err) next(err);
//     else {
//       res.set({"Content-Disposition":"attachment; filename=\"" + moment().format() +".csv\""});      
//       res.send(string);
//     }
//   });
// });

// router.get('/rows/switchoff', function(req, res, next) {
//   // var rows = req.body.rows? req.body.rows: undefined;
//   switch_off(undefined, function (err, string) {
//     if (err) next(err);
//     else {      
//       res.end('OK');
//     }
//   });
// });


//init
router.get('/', mustAuthenticatedMw, function(req, res) {
  res.render('pages/index', {auth: req.auth, message: null});       
});

router.post('/login', function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    else if (user) {
      res.redirect('/');
    } else return res.render('pages/index', {auth: req.auth, message: info.message}); 
  })(req, res, next);
});


//show all rows
router.get('/rows', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) {  
  show_rows(req.query.all,function (err, rows) {
    if (err) next(err);
    else {
      res.send(rows);
    }
  });
});

//show free ips
router.get('/freeip', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) {  
  show_ips(req.query.type,function (err, rows) {
    if (err) next(err);
    else {
      res.send(rows);
    }
  });
});

//add add row
router.post('/rows', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) {
  add_row(req.body, function (err, saved_data) {
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});

//remove rows
router.delete('/rows', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) { 
  remove_row(req.body, function (err) {
    if (err) next(err);
    else {      
      res.status(200).end();
    }
  });
});

//edit row
router.put('/row', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) {
  edit_row(req.body, function (err, saved_data) {
    console.log(err);
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});

//edit rows
router.put('/rows', mustAuthenticatedMw, mustBeAdmin, function(req, res, next) {
  edit_rows(req.body, function (err) {
    if (err) next(err);
    else {
      res.status(200).end();
    }
  });
});
module.exports = router;