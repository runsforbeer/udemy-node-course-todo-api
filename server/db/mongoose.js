const mongoose = require('mongoose');

// tell Mongoose to use native JS promise library
mongoose.Promise = global.Promise;

// todoapp collection will be created if it doesn't exist... even with mLab
mongoose.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp');

module.exports = {
    mongoose: mongoose
};