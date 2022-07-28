let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
require('dotenv').config()

var userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    following: { type: Boolean },
    followingList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followersList: [{ type: Schema.Types.ObjectId, ref: 'User' }]
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

userSchema.methods.displayUser = function (id = null) {
    return {
      name: this.name,
      username: this.username,
      bio: this.bio,
      avatar: this.avatar,
      following: id ? this.followersList.includes(id) : false,
    };
};

module.exports = mongoose.model('User', userSchema);