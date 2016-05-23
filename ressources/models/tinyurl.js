var mongoose = require('mongoose');

module.exports = mongoose.model('TinyURL',{
	id: String,
	url:String
});