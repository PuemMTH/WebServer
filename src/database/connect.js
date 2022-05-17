const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB connected');
    }).catch(err => {
        // console.log(err);
        console.log('MongoDB connection error');
        console.error(err);
        process.exit(1);
    })
}