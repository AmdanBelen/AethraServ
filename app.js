/**
 * Created by atulr on 05/07/15.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib =  nib = require('nib');

var app = express();

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
  res.render('homepage', { title: 'Aethra', message: 'Aethra'});
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
  res.render('error.pug',{status:err.status,message:err.message})
});


module.exports = app;