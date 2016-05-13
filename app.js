/**
 * Created by atulr on 05/07/15.
 */
var express = require('express');
var mailer = require('express-mailer');
var mongoose = require('mongoose');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib =  nib = require('nib');


var app = express();


mailer.extend(app, {
    from: process.env.OPENSHIFT_NODEJS_EMAIL_ADDR,
    host: 'mail.pawnmail.com',
    port: 587,
    secure: false,
    requireTLS:true, 
    auth: {
        user: process.env.OPENSHIFT_NODEJS_EMAIL_ADDR,
        pass: process.env.OPENSHIFT_NODEJS_EMAIL_PSWD
    }
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(stylus.middleware({
  src: __dirname + '/ressources',
  dest: __dirname + '/public',
  compile:compile
}));
app.set('views', './views');
app.set('view engine', 'pug');


var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME+":"+process.env.OPENSHIFT_MONGODB_DB_PASSWORD+"@"+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/'+process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect(connection_string, function(err, db) {
  if(err) throw err;
});



app.get('/', function (req, res) {
  res.render('home', { title: '', message: 'Aethra'});
});

app.get('/me', function (req, res) {
  res.render('meee', { title: 'Me'});
});

app.get('/article', function (req, res) {
  res.render('article', { title: 'Article'});
});

app.get('/test', function (req, res) {
  res.render('test', { title: 'Test'});
});
app.get('/mail', function (req, res) {
  app.mailer.send('test',{
    from: process.env.OPENSHIFT_NODEJS_EMAIL_ADDR,
    to: 'admin@aethra.io',
    subject: 'Test Email',
    otherProperty: 'Other Property'
  }, function (err) {
    if (err) {
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});

app.get('/api/:cmd', function(req, res) {
  //res.send("Api request : " + req.params.cmd +"(key: "+req.query.key+")");// ip/api/###?key=##
  res.json({cmd:req.params.cmd,key:req.query.key});
});
app.get('/api', function(req, res) {
  res.json({Error:"Not available"});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var error_code = (err.status||500);
  //res.send('Error: '+ err.message );
  res.render('error.pug',{title:error_code,status:error_code,message:err.message})
});


module.exports = app;