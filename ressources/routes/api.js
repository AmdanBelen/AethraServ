var express = require('express');
var router = express.Router();

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

  router.get('/', function (req, res) {
    res.json({message:'Welcome to the API'});
  });

  router.get('/users',isAuthenticated, function (req, res) {
  	User.find({}, function(err, users) {
    	var userMap = {};
    	users.forEach(function(user) {
      		userMap[user._id] = user;
    	});
    	res.json(userMap);
  	});
  });

  return router;
}