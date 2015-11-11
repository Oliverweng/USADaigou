
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var models = {};

//here is all the models definition.
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname:String,
    age: String,
    location: String,
    gender: String,
    role: String
});

var categorySchema = new mongoose.Schema({
    name: String,
    image: String
}, { collection: 'productCategories' });

var itemsSchema = new mongoose.Schema({
    name: String,
    alias: String,
    description: String,
    categoryId: Number
}, { collection: 'itemsCollection' });

//using autoIncrement plugin to auto increment ids
userSchema.plugin(autoIncrement.plugin, 'User');
categorySchema.plugin(autoIncrement.plugin, 'Category');
itemsSchema.plugin(autoIncrement.plugin, 'Item');

models.user = mongoose.model('User', userSchema);
models.category = mongoose.model('Category', categorySchema);
models.item = mongoose.model('Item', itemsSchema);

module.exports = models;