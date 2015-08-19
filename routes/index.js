var express = require('express');
var router = express.Router();
var http = require('https');

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

router.post('/getScholarships', function(req, res) {
	var stringJsonBody = JSON.stringify(req.body),
        options = {
            hostname: 'api.scholarshipexperts.com',
            path: '/scholarshipfinder/v1/scholarships.json?auth=eec6029a-4c6d-4042-81d6-7e755c0cd21c',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    sendXDomainRequest(options, function (data) {res.send('data is ' + data)}, 4000, function () {}, stringJsonBody);
});

function sendXDomainRequest(options, successCallBack, timeout, timeOutCallBack, reqBody) {
    var req = http.request(options, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
            // console.log('got data with data chunk:' + chunk);
        });
        response.on('end', function () {
            console.log('Cross Domain API Call Succeeded!');
            var escaped = str.replace(/^throw [^;]*;/, '');
            var jsonObj = JSON.parse(escaped);
            successCallBack(jsonObj);
        });
    });
    if (reqBody) {
        req.write(reqBody);
    }
    req.end();
    req.on('socket', function (socket) {
        socket.setTimeout(parseInt(timeout, 10));
        socket.on('timeout', function () {
            console.log('Cross Domain API Call Timed Out!');
            req.abort();
            timeOutCallBack();
        });
    });
    req.on('error', function (e) {
        console.error(e);
        successCallBack('');
    });
}
 
// Search Scholarships
exports.searchScholarships = function (jsonBody, successCallBack) {

};



module.exports = router;
