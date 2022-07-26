var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


var bookSchema = new Schema({
    title: {type: String},
    description: {type: String},
    author: {type: String},
    price: {type: Number},
    quantity: {type: Number, default: 0},
    category: [String],
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true}],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema);
