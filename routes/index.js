var express = require('express');
var dbCalls = require('../dbCalls');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
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

    /* GET Home Page */
    router.get('/admin', isAuthenticated, function(req, res){
        dbCalls.getContent(req, function (content) {
            // Display main page.
            res.render('admin-panel/admin_index', content);
        });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}





