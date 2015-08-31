var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://oweng:Password1@ds031873.mongolab.com:31873/heroku_98hbv9x6');
var dbCalls = {};

dbCalls.getContent = function (callback) {
	var categoriesCollection = db.get('productCategories');
	categoriesCollection.find({}, {}, function(e, docs){
		var context = {};
		context.headerCategories = docs;
		callback(context);
    });
};

dbCalls.getUsers = function (callback) {
	var usersCollection = db.get('userlist');
	usersCollection.find({}, {}, function (e, docs) {
		callback(docs);
	});
};

module.exports = dbCalls;