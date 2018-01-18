const mongoose = require('mongoose');

// tell Mongoose to use native JS promise library
mongoose.Promise = global.Promise;

// todoapp collection will be created if it doesn't exist... even with mLab
mongoose.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({  // must run as constructor function
    text: 'Cook dinner'
});

var anotherTodo = new Todo({
    text: 'Create a new todo',
    completed: true,
    completedAt: 13245
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Could not save model:', e);
});

anotherTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Could not save model:', e);
});
