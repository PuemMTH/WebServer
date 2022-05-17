const mongoose = require('mongoose');

const CatchSchema = new mongoose.Schema({
    time: {
        type: String,
        default: null
    },
    data_record : {
        type: Object,
        default: null
    }
});

module.exports = mongoose.model('CatchIndex', CatchSchema);