const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true },
    type: { type: String, default: 'user' },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', User);