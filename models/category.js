
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var categorySchema = new mongoose.Schema({
    name: String,
    image: String
}, { collection: 'productCategories' });

//using autoIncrement plugin to auto increment ids
categorySchema.plugin(categorySchema.plugin, 'Category');

module.exports = mongoose.model('Category', categorySchema);
