// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('mongodb://oweng:Password1@ds031873.mongolab.com:31873/heroku_98hbv9x6');
var models = require('./mongooseModels');
var dbCalls = {};

dbCalls.getContent = function (req, callback) {
    // var categoriesCollection = db.get('productCategories');
    models.category.find({}, function(e, docs){
        var context = {};
        context.isAuthenticated = req.isAuthenticated();
        if (context.isAuthenticated) {
            context.user = req.user;
            if (req.user.role === 'admin') {
                context.user.isAdmin = true;
            }
        }
        context.headerCategories = docs;

        callback(context);
    });
};


module.exports = dbCalls;