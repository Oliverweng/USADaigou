var express = require('express');
var router = express.Router();

module.exports.controller = function (req, res, next) {
	var categories = req.db.get('productCategories');
	req.context = {'categories': categories};
	next();
}