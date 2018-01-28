const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})
// Todo.remove({})

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id:'5a652a5bf36d287087a219c2'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5a652a5bf36d287087a219c2').then((todo) => {
    console.log(todo);
});