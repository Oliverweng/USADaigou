var express = require('express');
var router = express.Router();
var request = require('request');
var dbCalls = require('../dbCalls');
var passport = require('passport');
var content = {};


/* GET home page. */
router.get('/', function(req, res, next) {
    //populate global json needed by dust pages.
    dbCalls.getContent(function (content) {
        res.render('index', content);
    });
});

router.get('/login', function(req, res){
    res.render('login');
});
  
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.send('success');
});


module.exports = router;
