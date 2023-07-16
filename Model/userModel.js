const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    email: {
        type: String,
        required: true
    }, password: {
        type: String,
        required: true
    }
}, { timestamps: true });



module.exports.User = model('User', userSchema);