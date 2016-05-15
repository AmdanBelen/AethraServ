var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(){

        add_user = function(req, password, done) {
            var email = req.param('email');
            findOrCreateUser = function(){
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err){
                        return {message:err};
                    }
                    if (user) {
                        return {message:'User Already Exists'};
                    } else {
                        var newUser = new User();
                        newUser.email = req.param('email');
                        newUser.permission = 0;
                        newUser.password = createHash(password);
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        newUser.save(function(err) {
                            if (err){
                                throw err;  
                            } 
                            return {message:'User Added'};
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }


    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}