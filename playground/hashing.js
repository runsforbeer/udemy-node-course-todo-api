const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pwd = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pwd, salt, (err, hash) => {
        console.log(hash);
    });
});

var hash1 = '$2a$15$R3X.j6VH5SIAuIIjT9I3Ue193ewpbeTL5vWzbmjO7ukz70JC.7.Oi';
var hash2 = '$2a$10$lLL4hquaA9fhRmxwTnz8TOW/wI1qjKezIyuL932pxirXkGh0gyU62';

bcrypt.compare(pwd, hash1, (err, res) => {
    console.log('hash1 response: ' + res);
});

bcrypt.compare(pwd, hash2, (err, res) => {
    console.log('hash2 response: ' + res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data,'123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// var message = 'Some value to hash';
// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var data = {
//     id: 4
// };
// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'some salt').toString()
// };


// // man in middle attack
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'some salt').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed, DONT trust!');
// }