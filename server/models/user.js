const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
}, { usePushEach: true }); // this opton is to maintain backward compatibility - get pushAll error otherwise

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
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, process.env.JWT_SECRET).toString();
    console.log('Generated token:', token);

    // add our new jwt token to the tokens array
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    // mongodb operator to pull from array
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
}

// does not require an instance
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        // JWT verify throws exception if not valid
        decoded = jwt.verify(token, process.env.JWT_SECRET);
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

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            console.log('Did not find user... rejcting.');
            return Promise.reject();
        }

        // check password
        return new Promise((resolve,reject) => {
            bcrypt.compare(password,user.password, (err,res) => {
                if(res) {
                    console.log('Passwords match, returning user');
                    resolve(user);
                } else {
                    console.log('Passwords do not match');
                    reject();
                }
            });
        })
    });
};

// middleware to handle hashing
UserSchema.pre('save', function (next) {
    var user = this;

    // we only want to hash the pwd if it's been modified
    if(user.isModified('password')) {
        // user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};