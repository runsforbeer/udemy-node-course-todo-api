const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a62ab8d5b1567ef4ed82b8cXX';
var userId = '5a61572a6ce30dc349159c79';

// if(!ObjectID.isValid(id)) {
//     console.log('ID is not valid');
// };

// Todo.find({ // returns array, even if one is found
//     _id: id // mongoose doesn't require new ObjectID
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id: id // mongoose doesn't require new ObjectID
// }).then((todo) => {
//     console.log('Todo',todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo by id', todo);
// }).catch((e) => {
//     console.log(e);
// });;

// challenge:
// 1. query users collection
// 2. User.findById
// 3a. handle success w/ no user "user not found"
// 3b. user found
// 3c. print errors

User.findById(userId).then((user) => {
    if(!user) {
        return console.log('Unable to find user');
    }

    console.log('User found:', user);
}).catch((e) => console.log(e));