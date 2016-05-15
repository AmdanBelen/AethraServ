var express = require('express');
var router = express.Router();

module.exports = function(passport){

	router.use(function (req, res, next) {
		if (req.isAuthenticated()){
			res.locals.isAuthenticated = req.isAuthenticated();
  			res.locals.user = req.user;
    		next();
    	}else{
  			res.redirect('/');
  		}
	});


  router.get('/', function (req, res) {
    //res.render('admin', { title: '', message: 'Aethra'});
    res.send("admin: "+req.user);
  });

  router.get('/me', function (req, res) {
    res.render('meee', { title: 'Me'});
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

  router.get('/manage_users', function(req, res){
    res.render('manage_users',{message: req.flash('message')});
  });

  router.post('/manage_users', passport.authenticate('register'), 
    function (req, res) {
      if(req.user)
        res.json({message:"Added User"});
      else
        res.json({message:"Failed Adding User"});
    }
  );

  return router;
}