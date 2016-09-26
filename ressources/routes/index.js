var express = require('express');
var router  = express.Router();
var path    = require("path");

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport){

  router.use(function (req, res, next) {
      res.locals.LoginMessage = req.flash('message');
      next();
  });

  router.get('/', function (req, res) {
    res.render('home', { title: '', message: 'Aethra'});
  });

  router.get('/me', function (req, res) {
    res.render('meee', { title: 'Me'});
  });

  router.get('/article', function (req, res) {
    res.render('article', { title: 'Article'});
  });

  router.get('/test', function (req, res) {
    res.render('test', { title: 'Test'});
  });
  router.get('/mail', function (req, res) {
    router.mailer.send('test',{
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
  router.get('/googlebb3d7421a06181c9.html', function (req,res){
    res.sendFile(path.join(__dirname+'/public/googlebb3d7421a06181c9.html'));
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/admin',
    failureRedirect: '/',
    failureFlash : true  
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return router;
}