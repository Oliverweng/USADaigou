var express = require('express');
var router = express.Router();
var models = require('../mongooseModels');
var async = require('async');
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var cloudinary = require('cloudinary');

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

var handleErr = function (err, res) {
    console.log(err);
    res.send(err);
}

var itemRemoveCallback = function (item, req, res) {
    item.remove();
    req.flash('message', 'Item Removed Successfully!');
    req.flash('isSuccess', true);
    res.redirect('/admin/removeItem');
}

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display main page.
        res.render('index');
    });

    /* Login page*/
    router.get('/login', function(req, res) {
        res.render('login');
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

    /* Handle Item List Page*/
    router.get('/itemList', function (req, res) {
        var id = req.query.catId,
            content = {};
        if (!id) return handleErr('no category id present', res);
        models.item.find({categoryId: id}, function(e, docs){
            if(!docs) return handleErr('no items found under the category ID: ' + id, res);
            content.items = docs;
            content.currentCatId = id;
            res.render('itemList', content);
        });
    });

    /* Handle Item Detail Page*/
    router.get('/itemDetail', function (req, res) {
        var id = req.query.id,
            content = [];
        if (!id) return handleErr('no item id present', res);
        models.item.findById(id, function (err, item) {
            if (!item) return handleErr('no item found by ID ' + id, res);
            models.category.findById(item.categoryId, function (err, category) {
                if(err) return handleErr('something wrong on category retrieving.', res);
                item.categoryName = category.name;
                content.item = item;
                res.render('itemDetail', content);
            });
        });
    });

    router.post('/itemRemove', function (req, res) {
        var id = req.body.itemID,
            imageIDs = [];
        if (!id) return handleErr('no item id present', res);
        models.item.findById(parseInt(id, 10), function (err, item) {
            if (!item) return handleErr('can not find the item', res);
            if (item.images && Array.isArray(item.images) && item.images.length) {
                item.images.forEach(function (image, ind, list) {
                    if (image.publicID) {
                        imageIDs.push(image.publicID);
                    }
                });
            }
            if (imageIDs.length) {
                imageIDs.forEach(function (publicID, ind, list) {
                    cloudinary.uploader.destroy(publicID, function(result) {
                        itemRemoveCallback(item, req, res);
                    });
                });
            } else {
                itemRemoveCallback(item, req, res);
            }
        });
    });

    /* GET Admin Page */
    router.get('/admin/:page*?', isAdmin, function(req, res){
        var pageName = req.params.page;
            // Display main page.
        if (pageName) {
            res.render('admin/' + pageName);
        } else {
            res.send('The page doesn\'t exist');
        }
    });
    router.post('/itemCreation', isAdmin, upload.array('itemImages', 5), function (req, res) {
        //check for the passed in object and define variables.
        var itemName = req.body.itemName,
            itemDes = req.body.itemDescription,
            itemAlias = req.body.itemAlias,
            itemPrice = req.body.itemPrice,
            itemCategory = req.body.itemCategory,
            errorContainer = '',
            asyncTasks = [],
            success = 'success';
        if (itemName && itemDes && itemAlias && itemCategory && itemPrice) {
            //Check whether any existing item has the name yet.
            var newItem = new models.item();
            models.item.findOne({ 'alias': itemAlias}, function (err, item) {
                if (!item) {
                    var files = req.files;
                    if (files.length) {
                        files.forEach(function (ele, ind, list) {
                            asyncTasks.push(function (callback) {
                                var base64data = new Buffer(ele.buffer).toString('base64');
                                base64data = 'data:image;base64,' + base64data;
                                cloudinary.uploader.upload(base64data, function(result) {
                                    if (result.error) {
                                        errorContainer = result.error;
                                    } else {
                                        newItem.images.push({url: result.url, publicID: result.public_id});
                                    }
                                    callback();
                                });
                            });
                        });
                    }
                    async.parallel(asyncTasks, function() {
                        if (!errorContainer) {
                            newItem.name = itemName;
                            newItem.alias = itemAlias;
                            newItem.description = itemDes;
                            newItem.price = itemPrice;
                            newItem.categoryId = parseInt(itemCategory, 10);
                            // save the user
                            newItem.save(function(err, item) {
                                if (err){
                                    console.log('Error in Saving item: ' + err);
                                    errorContainer = 'Error in Saving item: ' + err;
                                    req.flash('message', errorContainer);
                                    res.redirect('admin/addNew');
                                } else {
                                    console.log('Item saved succesfully');
                                    req.flash('message', 'Item Saved Successfully!');
                                    req.flash('isSuccess', true);
                                    res.redirect('admin/addNew');
                                }
                            });
                        } else {
                            req.flash('message', errorContainer);
                            res.redirect('admin/addNew');
                        }
                    });
                } else {
                    req.flash('message', 'An item with the same alias exists already!');
                    res.redirect('admin/addNew');
                }
            });
        } else {
            req.flash('message', 'Please fill out all the fields!');
            res.redirect('admin/addNew');
        }
    });
    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}






