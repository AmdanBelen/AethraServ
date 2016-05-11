/**
 * Created by atulr on 05/07/15.
 */
var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib =  nib = require('nib');

var app = express();

var smtpTrans = nodemailer.createTransport('SMTP', {
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
  var mailOpts;

  //Mail options
  mailOpts = {
      from: 'admin@aethra.io',//req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
      to: 'admin@aethra.io',
      subject: 'Website contact form',
      text: 'Test'//req.body.message
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
      //Email not sent
      if (error) {
          res.render('error', { title: 'Error', status:"Mail not sent", message: 'Error occured, message not sent.' })
      }
      //Yay!! Email sent
      else {
          res.render('error', { title: 'Mail Sent', status:"Mail sent", message: 'Message sent! Thank you.' })
      }
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
  //res.send('Error: '+ err.message );
  res.render('error.pug',{title:err.status,status:err.status,message:err.message})
});


module.exports = app;