const mongoose = require('mongoose');

// tell Mongoose to use native JS promise library
mongoose.Promise = global.Promise;

// todoapp collection will be created if it doesn't exist... even with mLab
mongoose.connect(process.env.MONGODB_URI);
console.log('Initializing database at', process.env.MONGODB_URI);

module.exports = {
    mongoose: mongoose
};
