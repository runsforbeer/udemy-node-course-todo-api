var {User} = require('./../models/user');

// create middleware function
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject(); // will hit the 401 below in the catch
        }

        // modify our request object, so functions that user this middleware can get user
        req.user = user;
        req.token = token;

        next();
    }).catch((e) => {
        res.status(401).send();;
    });  
};

module.exports = {authenticate};