var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'this is my first nodeJS app' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Beautiful Yan Lu' });
});


/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('itemscollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('itemscollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

router.post('/scholarships', function(req, res) {
    var stringJsonBody = JSON.stringify(req.body),
        options = {
            url: 'https://api.scholarshipexperts.com/scholarshipfinder/v1/scholarships.json?auth=eec6029a-4c6d-4042-81d6-7e755c0cd21c',
            method: 'POST',
            body: stringJsonBody,
            timeout: 4000
        };
    sendXDomainRequest(options, function (data) {res.send(data)}, function (error) {res.send('error is: ' + error)});
});

router.get('/community', function(req, res) {
    var options = {
            url: 'https://communityuat.saltmoney.org/api/core/v3/contents?sort=dateCreatedDesc&amp;fields=%40all&amp;count=100&amp;startIndex=0&filter=tag(jobs)',
            method: 'GET',
            json: true,
            timeout: 3000,
            auth: {
                'user': 'contentmodule',
                'pass': 'Password_1'
            }
        };
    sendXDomainRequest(options, function (data) {res.send(data)}, function () {});
});

function sendXDomainRequest(options, successCallBack, timeOutCallBack) {
    request(options, function (error, response, body) {
        if (error && error.code === 'ETIMEDOUT') {
            console.log('Cross Domain API Call Timed Out!');
            timeOutCallBack(error);
        }
        else if (!error && response.statusCode === 200) {
            console.log('Cross Domain API Call Succeeded!');
            //clean up data
            var escaped = body.replace(/^throw [^;]*;/, ''); 
            var result = JSON.parse(escaped);
            successCallBack(result);
        }
    });
}


module.exports = router;
