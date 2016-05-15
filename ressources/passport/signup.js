var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err){
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        newUser.save(function(err) {
                            if (err){
                                throw err;  
                            } 
                            return done(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}