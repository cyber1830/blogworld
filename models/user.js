
const { createHmac, randomBytes, Hash } = require('node:crypto');
const { Schema, model } = require("mongoose");
const { createToken } = require('../services/auth');


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/deafult.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, 
    { timestamps: true}
);

userSchema.pre('save', function (next) {
    const user = this; // currentuser
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassowrd =  createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
    this.salt = salt;
    this.password = hashedPassowrd;

    next();
});

userSchema.static("matchPasswordAndGenerateToekn", async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found!');

    const salt = user.salt;
    const hashedPassowrd = user.password;

    const userProvidedHash =  createHmac('sha256', salt)
    .update(password)
    .digest('hex');
 
    if(hashedPassowrd !== userProvidedHash) throw new Error("Incorrect password");
    const token = createToken(user);
    return token;
});
const User = model('user', userSchema);

module.exports = User;