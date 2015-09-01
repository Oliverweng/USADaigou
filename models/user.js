
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

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
//using autoIncrement plugin to auto increment ids
userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', userSchema);
