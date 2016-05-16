var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('register', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            findOrCreateUser = function(){
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err){
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('message','User Already Exists'));
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