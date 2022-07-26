var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


var commentSchema = new Schema({
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    bookId: {type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);