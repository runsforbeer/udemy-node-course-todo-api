const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log('Created note.', doc);
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/1234
app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({});
        }
        res.send({todo});
    }).catch((e) => {
        res.status(500).send('There was an error getting the note');
    });
});

app.listen(port, () => {
    console.log('Listening on port ', port);
});

module.exports = {
    app: app
};