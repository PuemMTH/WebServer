const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: null
    },
    last_name : {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'users'
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model('users', usersSchema);