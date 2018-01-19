const mongoose = require('mongoose');

var User = mongoose.model('User', {
    // email
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    }
});

module.exports = {User};