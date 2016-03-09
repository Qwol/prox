var fs = require('fs');
var nodemailer = require('nodemailer');
var moment = require('moment');
var row = require('../models/user');
var async = require('async');
var email = require('../config/app-config.js').email;
var writeSecret = require('./write-secret');

var transporter = nodemailer.createTransport();

function getRndPass () {  
  return Math.random().toString(36).slice(2, 12);
}

function getRndLogin () {  
  return Math.random().toString().slice(2, 12);
}

function getCb (data, types, report) {
  switch (parseInt(data.base)) {
    case 0:
      if (data.status == 1) {
        return function (row, cb) {          
          row.login = row.type + getRndLogin();
          row.password = getRndPass();
          row.status = data.status;
          row.end_date = null;
          if (!(types.indexOf(row.type) + 1)) types.push(row.type);
          report[row.type] += 'Login: ' + row.login + '\t||\tPassword: ' + row.password +'\n';
          row.save(cb);
        }
      } else return function (row, cb) { 
        cb(null);
      };
      break;
    case 1:
      if (data.status == 2) {
        return function (row, cb) {                    
          row.status = data.status;
          row.end_date = data.end_date;
          if (!(types.indexOf(row.type) + 1)) types.push(row.type);
          report[row.type] += 'Login: ' + row.login + '\t||\tPassword: ' + row.password +'\n';
          row.save(cb);
        }
      } else return function (row, cb) { 
        cb(null);
      };
      break;
    case 2:
      return function (row, cb) { 
        cb(new Error('Для этого статуса редактирование не предназначено'));
      };
      break;
    case 3:
      if (data.status == 1) {
        return function (row, cb) {          
          row.login = row.type + getRndLogin();
          row.password = getRndPass();
          row.status = data.status;
          row.end_date = null;
          if (!(types.indexOf(row.type) + 1)) types.push(row.type);
          report[row.type] += 'Login: ' + row.login + '\t||\tPassword: ' + row.password +'\n';
          row.save(cb);
        }
      } else return function (row, cb) { 
        cb(null);
      };
      break;
  }
}

module.exports = function (data, callback) {
  var attachments = [];
  var variables = {
    types: [],
    report: {
      a: '',
      s: '',
      m: '',
      l: '',
      xl:'',
      t: ''
    }
  };
  var types = variables.types;
  var report = variables.report;

  var cbFunc = getCb(data, types, report);

  row(function (err, model) {
    if (err) callback(err);
    else {               
      var doc = (data.status == 3)? {
        status: data.status,
      }: {
        login: data.login,
        password: data.password,
        status: data.status,
        end_date: data.end_date
      };
      model.find({_id: { $in: data.ips}}, function (err, rows) {
        if (err) callback(err);
        else {
          async.each(rows, cbFunc, function (err) {
            if (err) callback(err);
            else {
              async.each(types, function (item, cbi) {  
                // fs.writeFile('app/public/reports/' + item + '_' + moment(Date.now()).format("YYYY-MM-DD_HH:mm") + '.csv', report[item], {encoding: 'utf8'}, cbi);
                
                var name = item + '_' + moment(Date.now()).format("YYYY-MM-DD_HH:mm") + '.csv';
                var data = report[item];                
                attachments.push({
                  filename: name,
                  content: data
                });
                fs.writeFile(config.report_path + name, data, function (err) {
                  if (err) {
                    console.log(err);
                    cbi();
                  } else cbi();
                });                
              }, function (err) {
                if (err) callback(err);
                else {
                  writeSecret(function (err) {
                    if (err) callback(err);
                    else if (data.status == 1) {
                      var mailOptions = {
                        from: 'Proxy4Game <noreply@proxy4game.com>', // sender address
                        to: email, // list of receivers
                        subject: 'Accounts added!', // Subject line
                        text: 'Reports by ' + moment(Date.now()).format("DD.MM.YYYY HH:mm"), // plaintext body
                        attachments: attachments                  
                      };

                      transporter.sendMail(mailOptions, function(err, info){
                        if(err){
                          callback(err);
                        }else{
                          callback(null);
                        }
                      });
                    } else callback(null);
                  });                                 
                }
              });
            }
          });
        }
      });      
    }
  });
};