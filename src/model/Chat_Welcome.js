const mongoose = require('mongoose');

const chatsSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: null
    },
    last_name : {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'users'
    }
});

module.exports = mongoose.model('chats', chatsSchema);