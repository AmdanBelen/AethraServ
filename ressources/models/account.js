var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	permission:Number,
	password: String,
	email: String,
	firstName: String,
	lastName: String
});