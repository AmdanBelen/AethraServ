var mongoose = require('mongoose');

module.exports = mongoose.model('Wiki',{
	page: String,
	text:String
});