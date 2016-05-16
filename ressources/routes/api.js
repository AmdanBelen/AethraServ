var express = require('express');
var router = express.Router();
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


module.exports = function(passport){

  router.get('/', function (req, res) {
    res.json({message:'Welcome to the API'});
  });

  router.get('/users',isAuthenticated, function (req, res) {
  	User.find({}, function(err, users) {
    	//var userMap = {};
    	//users.forEach(function(user) {
      	//	userMap[user._id] = user;
    	//});
    	res.json(users);
  	});
  });

  router.post('/user/delete/:email',isAuthenticated, function (req, res) {
    var email = req.params.email;
    User.find({email:email}).remove(function(){res.json({message:"Deleted User"})});
  });

  router.post('/user/add',isAuthenticated, function(req, res) {
    var email = req.body.username;
    res.send(req);
    var password = req.body.password;
    User.findOne({ 'email' :  email }, function(err, user) {
      if (err){
          res.json({message:"Server Error"})
      }
      if (user) {
          User.permission = req.body.permission;
          User.firstName = req.body.firstName;
          User.lastName = req.body.lastName;
          User.save();
          res.json({message:"User Modified"});
      } else {
          var newUser = new User();
          newUser.email = email;
          newUser.permission = req.body.permission;
          newUser.password = createHash(password);
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.save(function(err) {
              if (err){
                  throw err;  
              } 
              res.json({message:"User Created"})
          });
      }
    });
  });

  return router;
}