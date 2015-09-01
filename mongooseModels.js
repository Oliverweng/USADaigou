
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var models = {};

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname:String,
    age: String,
    location: String,
    gender: String
});

var categorySchema = new mongoose.Schema({
    name: String,
    image: String
}, { collection: 'productCategories' });

//using autoIncrement plugin to auto increment ids
userSchema.plugin(autoIncrement.plugin, 'User');
categorySchema.plugin(autoIncrement.plugin, 'Category');

models.user = mongoose.model('User', userSchema);
models.category = mongoose.model('Category', categorySchema);

module.exports = models;