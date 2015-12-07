var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var passport = require('passport');
var cloudinary = require('cloudinary');
var flash = require('connect-flash');
var passport = require('passport');

//DB connection
var dbConfig = require('./db');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect(dbConfig.url);
autoIncrement.initialize(mongoose);
var dbCalls = require('./dbCalls');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('dust', cons.dust);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.set('template_engine', 'dust');

//config cloudinary, the image upload platform
cloudinary.config({ 
    cloud_name: 'daigouusaimages',
    api_key: '191682981685313',
    api_secret: '3tKEKXFpkfWQxMDVt6Lj2jbEu2o'
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
app.use(expressSession({secret: 'myScretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(cookieParser('secret'));
app.use(expressSession({cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.flag = req.flash('isSuccess');
    res.locals.message = req.flash('message');
    dbCalls.getContent(req, res, next);
});

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
