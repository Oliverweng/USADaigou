var express = require('express');
var dbCalls = require('../dbCalls');
var router = express.Router();
var models = require('../mongooseModels');

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
        //check for the passed in object.
        var itemName = req.body.itemName,
            itemDes = req.body.itemDes,
            itemAlias = req.body.itemAlias,
            itemImages = req.body.itemImages;
            itemCategory = req.body.itemCategory;
        if (itemName && itemDes && itemAlias && itemImages && itemCategory) {
            // var fs = require('fs'),
            //     imageBase64 = req.body.itemImages,
            //     imageBase64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
            //     fs.writeFile('public/images/items/out.png', imageBase64Data, 'base64', function (err) {
            //         console.log(err); 
            //     });
            var newItem = new models.item();
            newItem.name = itemName;
            newItem.alias = itemAlias;
            newItem.description = itemDes;
            newItem.categoryId = parseInt(itemCategory, 10);

            // save the user
            newItem.save(function(err) {
                if (err){
                    console.log('Error in Saving item: ' + err);
                    throw err;  
                }
                console.log('Item saved succesfully');
                res.send('post accpected');
            });
        } else {
            req.flash('message', 'Please fill out all the fields!');
        }

    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}





