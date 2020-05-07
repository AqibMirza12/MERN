const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, //unique speeds up querying process
    password: {type: String, required: true, minlength: 6}, //minimum length of chars
    image: {type: String, required: true},
    places: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); //add a third-party package to a schema

module.exports = mongoose.model('User', userSchema);