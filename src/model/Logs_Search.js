var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaveSchema = new Schema({
    Search: String,
    user: String,
    idAnime: String,
    date: String
})

module.exports = mongoose.model('SaveSearch', SaveSchema);