var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();


var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true }
 }, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.varifyPassword = async function(password) {
    try {
        var result = await bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        return next(error);
    }
};

userSchema.methods.signToken = async function(){
    var payload = {user: this.id, email: this.email};
    try {
        var token = await jwt.sign(payload, process.env.SECRET)
        return token;
    } catch (error) {
        return next(error);
    }
};

userSchema.methods.userJSON = function(token) {
    return {
        name: this.name,
        email: this.email,
        token: token
    }
}

module.exports = mongoose.model('User', userSchema);
