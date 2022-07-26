let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    cart: [{
        quantity: {type: Number, default: 0}, 
        book: {type: mongoose.Schema.Types.ObjectId, ref: "Book"}
    }]
 }, {timestamps: true});



userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
});

userSchema.methods.verifyPassword = async function(password) {
    try {
        var result = await bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        return error;
    }
};


userSchema.methods.signToken = async function(){
    var payload = {userId: this.id, email: this.email};
    try {
        var token = await jwt.sign(payload, process.env.SECRET)
        return token;
    } catch (error) {
        next(error);
    }
}

userSchema.methods.userJSON = function(token) {
    return {
        name: this.name,
        email: this.email,
        token: token
    }
}

module.exports = mongoose.model('User', userSchema);