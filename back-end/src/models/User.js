const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username must be less than 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar: {
        type: String,
        default: null
    },
    playlistCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Note: No need for schema.index() - unique: true already creates indexes

// Don't send password hash in JSON responses
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.passwordHash;
    delete user.__v;
    return user;
};

module.exports = mongoose.model('User', userSchema);