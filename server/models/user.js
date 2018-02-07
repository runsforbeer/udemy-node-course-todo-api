const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    // email
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// override toJSON so we only return properties we want to return (instead off all properties)
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id','email']);
};

// create some instance methods
UserSchema.methods.generateAuthToken = function() { // not an arrow function, because we need 'this'
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();
    console.log('Generated token:', token);

    // add our new jwt token to the tokens array
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

// does not require an instance
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        // JWT verify throws exception if not valid
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    // ??? not familiary with this array accessing in quotes below... must be a mongoose thing?
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};