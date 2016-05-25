var express = require('express');
var router = express.Router();
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');



var IsAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.json({message:"Not Authenticated"});
};
var HasPerm = function(level){
  return function(req,res,next){
    if(!level) level=0;
    if(req.user.permission>=level)
      return next();
    res.json({message:"Not Autorized"});
  };
};


var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


module.exports = function(passport){

  router.get('/', function (req, res) {
    res.json({message:'Welcome to the API'});
  });

  router.get('/users',IsAuthenticated, function (req, res) {
  	User.find({}, function(err, users) {
    	//var userMap = {};
    	//users.forEach(function(user) {
      	//	userMap[user._id] = user;
    	//});
    	res.json(users);
  	});
  });

  router.post('/user/delete/:email',IsAuthenticated, function (req, res) {
    var email = req.params.email;
    User.find({email:email}).remove(function(){res.json({message:"Deleted User"})});
  });

  router.post('/user/add',IsAuthenticated, function(req, res) {
    var email = req.body.username;
    var password = req.body.password;
    User.findOne({ 'email' :  email }, function(err, user) {
      if (err){
          res.json({message:"Server Error"});
      }
      if (user) {
          user.permission = req.body.permission;
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.save(function(err) {
              if (err){
                  throw err;  
              } 
              res.json({message:"User Modified"});
          });
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
              res.json({message:"User Created"});
          });
      }
    });
  });

  return router;
}