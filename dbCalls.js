var express = require('express');
var router = express.Router();
var dbCalls = {};
dbCalls.getContent = function (req, res, callback) {
	var categoriesCollection = req.db.get('productCategories');
	categoriesCollection.find({},{},function(e, docs){
		req.context = {};
		req.context.headerCategories = docs;
		callback(req.context);
    });
}
module.exports = dbCalls;