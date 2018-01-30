require('./config/config');

const _ = require('lodash');
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

app.delete('/todos/:id', (req,res) => {
    // get the id
    var id = req.params.id;

    // validate the id return 400 if not
    if(!ObjectID.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send('Could not find document');
        }

        return res.send({todo});
    }).catch((e) => {
        return res.status(500).send('There was an error deleting this record,', e);
    });
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    console.log('Updating note to ', JSON.stringify(body));
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); // ms since midnight 1970
    } else {
        console.log("completed was false or not a boolean");
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            console.log('Could not find note with ID',id);
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

// POST /users
app.post('/users', (req,res) => {
    var userParams = _.pick(req.body, ['email','password']);

    var user = new User({
        email: userParams.email,
        password: userParams.password
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        return res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log('Listening on port ', port);
});

module.exports = {
    app: app
};