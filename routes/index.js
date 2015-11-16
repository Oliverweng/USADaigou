var express = require('express');
var dbCalls = require('../dbCalls');
var router = express.Router();
var models = require('../mongooseModels');
var async = require('async');

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
    router.post('/itemCreation', isAdmin, function (req, res) {
        //TODO: need to check whether any existing item has the name yet.
        //check for the passed in object and define variables.
        var itemName = req.body.itemName,
            itemDes = req.body.itemDes,
            itemAlias = req.body.itemAlias,
            itemPrice = req.body.itemPrice,
            itemImages = req.body['itemImages[]'],
            itemCategory = req.body.itemCategory,
            errorContainer = [],
            asyncTasks = [],
            success = 'success';
        if (itemName && itemDes && itemAlias && itemImages && itemCategory && itemPrice) {
            var fs = require('fs');
            if (typeof itemImages === 'string') {
                itemImages = [itemImages];
            }
            itemImages.forEach(function (ele, ind, list) {
                asyncTasks.push(function (callback) {
                    fs.writeFile('public/images/items/' + itemAlias + '-' + ind + '.png', ele, 'base64', function (err) {
                        err = 1;
                        if (err) {
                            console.log(err);
                            errorContainer.push(err);
                        }
                        callback();
                    });
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
            req.flash('message', 'Please fill out all the fields!');
            res.send(req.flash());
        }
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}





