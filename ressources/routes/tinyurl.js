var express = require('express');
var router = express.Router();
var Tinyurl = require('../models/tinyurl');

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 10;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

module.exports = function (passport){

  router.get('/', function (req, res) {
    res.render('tinyurl', { title: 'TinyURL'});
  });

  router.get('/:id', function (req, res){
  	if(req.params.id == undefined){
  		res.send({error: 'No ID was entered.'});
  	}else{
  		var id = req.params.id;
  		Tinyurl.findOne({ 'id' :  id }, function(err, result) {
      		if (err){
          		res.json({message:"Server Error"});
      		}
      		if (result) {
         		res.redirect(result.url);
      		}else {
      		    res.json({message:"No matching ID found"});
     		 }
     	});
  	}
  });

  router.post('/', function (req, res) {
  	var url = req.body.url;
    var id = randomString();
    Tinyurl.findOne({ 'url' :  url }, function(err, result) {
      if (err){
          res.json({message:"Server Error"});
      }
      if (result) {
        id = result.id;
      } else {
          var newTUrl = new Tinyurl();
          newTUrl.url = url;
          newTUrl.id = id;
          newTUrl.save(function(err) {
            if (err){
                throw err;  
            }
          });
      }
      res.render('tinyurl', { title: 'TinyURL',id:"url.aethra.io/"+id,url:url});
    });
  });

  return router;
}