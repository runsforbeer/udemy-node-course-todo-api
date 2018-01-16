// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // the ES6 object destructuring way

// ES6 feature - object destructuring - pulling out properties from an object. ie.
// var user = {name: 'Don', age: 42};
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp', (err, db) => {
    if(err) {
        return console.log('There was an error connecting to the db: ' + err);
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert record',err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Don Marsh',
    //     age: 42,
    //     location: 'New Hampshire'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user record', err);
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    db.close();
    return;
});