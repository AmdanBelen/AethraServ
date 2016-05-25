var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var expressWiki = require('express-wiki');
var ExpressWikiMongoose = require('express-wiki-mongoose');


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
    res.render('wiki/index',{title:'test'});
  });

  router.use(expressWiki({
    datastore: new ExpressWikiMongoose({
        	mongoose: mongoose,
        	modelName:'WikiRecord'//Optional
    	})
	}));

  return router;
}