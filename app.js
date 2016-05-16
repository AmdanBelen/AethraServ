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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var flash    = require('connect-flash');
var session = require('express-session');


var app = express();

var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){ connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME+":"+process.env.OPENSHIFT_MONGODB_DB_PASSWORD+"@"+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/'+process.env.OPENSHIFT_APP_NAME;}
mongoose.connect(connection_string, function(err, db) { if(err) throw err;});

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

app.use(logger('short'));
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
app.set('trust proxy', true);
app.use(require('express-session')({ secret: 'CHANGE ME TO PROCESS ENV VAR', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});


var initPassport = require('./ressources/passport/init');
initPassport(passport);


var routes = require('./ressources/routes/index')(passport);
var admin = require('./ressources/routes/admin')((passport));
var api = require('./ressources/routes/api')((passport));
app.use('/', routes);
app.use('/api',api);
app.use('/admin', admin);

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



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}


module.exports = app;