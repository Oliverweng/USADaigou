var express = require('express');
var dbCalls = require('../dbCalls');
var router = express.Router();
var models = require('../mongooseModels');
var async = require('async');
var multer  = require('multer');
var count = 0;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/items/');
    },
    filename: function (req, file, cb) {
        //use count to distinguish the file name.
        cb(null, req.body.itemAlias + '-' + count + '.png');
        count++;
    }
});
var upload = multer({storage: storage});

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

var isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/');
}

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        dbCalls.getContent(req, function (content) {
            // Display main page.
            res.render('index', content);
        });
    });

    /* Login page*/
    router.get('/login', function(req, res) {
        // Display the Login page with any flash message, if any
        dbCalls.getContent(req, function (content) {
            // Display main page.
            res.render('login', content);
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true  
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res){
        res.render('register',{message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash : true  
    }));

    /* GET Admin Page */
    router.get('/admin/:page*?', isAdmin, function(req, res){
        var pageName = req.params.page;
        dbCalls.getContent(req, function (content) {
            // Display main page.
            if (pageName) {
                content.message = req.flash('message');
                res.render('admin/' + pageName, content);
            } else {
                res.send('The page doesn\'t exist');
            }
            
        });
    });
    router.post('/itemCreation', isAdmin, upload.array('itemImages', 5), function (req, res) {
        //check for the passed in object and define variables.
        var itemName = req.body.itemName,
            itemDes = req.body.itemDescription,
            itemAlias = req.body.itemAlias,
            itemPrice = req.body.itemPrice,
            itemCategory = req.body.itemCategory,
            errorContainer = [],
            asyncTasks = [],
            success = 'success';
        if (itemName && itemDes && itemAlias && itemCategory && itemPrice) {
            //Check whether any existing item has the name yet.
            models.item.findOne({ 'alias': itemAlias}, function (err, item) {
                if (!item) {
                    var fs = require('fs');
                    asyncTasks.push(function (callback) {
                        //TODO: instead of writing file to system, I need to use cloudinary
                        fs.readdir('public/images/items/', function (err, files) {
                            if (err) {
                                console.log(err);
                                errorContainer.push(err);
                            }
                            var flag = false;
                            files.forEach(function (ele, ind, list) {
                                if (ele.indexOf(itemAlias) !== -1 ) {
                                    flag = true;
                                }
                            });
                            if (!flag) {
                                errorContainer.push('images did not get uploaded to the items folder!');
                            }
                            callback();
                        });
                    });
                    async.parallel(asyncTasks, function() {
                        if (!errorContainer.length) {
                            var newItem = new models.item();
                            newItem.name = itemName;
                            newItem.alias = itemAlias;
                            newItem.description = itemDes;
                            newItem.price = itemPrice;
                            newItem.categoryId = parseInt(itemCategory, 10);
                            // save the user
                            newItem.save(function(err) {
                                if (err){
                                    console.log('Error in Saving item: ' + err);
                                    errorContainer.push(err);
                                    req.flash('message', 'Error in Saving item: ' + err);
                                    req.flash()
                                } else {
                                    console.log('Item saved succesfully');
                                    req.flash('message', 'Item Saved Successfully!');
                                    req.flash('success', true);
                                }
                                res.send(req.flash());
                            });
                        } else {
                            req.flash('message', 'Something wrong with image saving.');
                            res.send(req.flash());
                        }
                    });
                } else {
                    req.flash('message', 'An item with the same alias exists already!');
                    res.send(req.flash());
                }
            });
        } else {
            req.flash('message', 'Please fill out all the fields!');
            res.send(req.flash());
        }
        count = 0;
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}





