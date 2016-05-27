var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DB = require('../wiki/handler');


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
  router.get('/:page', function (req, res) {
    DB.loadPage(req.params.name, function (err, page) {
      if (err) return next(err);
      res.render('wiki/view', page);
    });
  });
  router.get('/:page/edit', function (req, res) {
    DB.loadPage(req.params.name, function (err, page) {
      if (err) return next(err);
      res.render('wiki/edit', page);
    });
  });
  router.post('/:page', function (req, res) {
    DB.savePage(req.params.name, req.body.markdown, function (err) {
      if (err) return next(err)
      res.redirect("/" + req.params.name);
    });
  });

  /*router.use(expressWiki({
    datastore: new ExpressWikiMongoose({
        	mongoose: mongoose,
        	modelName:'WikiRecord'//Optional
    	})
	}));*/

  return router;
}