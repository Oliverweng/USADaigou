var express = require('express');
var router = express.Router();

module.exports.setGlobalJSON = function (req, res, next) {
	var categories = req.db.get('productCategories');
	req.context = {'categories': categories};
	next();
}