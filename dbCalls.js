// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('mongodb://oweng:Password1@ds031873.mongolab.com:31873/heroku_98hbv9x6');
var models = require('./mongooseModels');
var dbCalls = {};

dbCalls.getContent = function (req, res, next) {
    // var categoriesCollection = db.get('productCategories');
    models.category.find({}, function(e, docs){
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
            res.locals.isAuthenticated = true;
            if (res.locals.user.role === 'admin') {
                res.locals.user.isAdmin = true;
            }
        }
        res.locals.headerCategories = docs;
        next();
    });
};

module.exports = dbCalls;