const {MongoClient, ObjectID} = require('mongodb'); // the ES6 object destructuring way

MongoClient.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp', (err, db) => {
    if(err) {
        return console.log('There was an error connecting to the db: ' + err);
    }

    // db.collection('Todos').find({
    //     _id: new ObjectID('5a5ae51c80ea2e39a70fae96')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find()
    //     .count()
    //     .then((count) => {
    //         console.log('Todos:', count);
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    // });

    db.collection('Users')
        .find({name:"Don Marsh"}).toArray()
        .then((docs) => {
            console.log('Users = don');
            console.log(JSON.stringify(docs,undefined,2));
        }
    );

    //db.close();
    return;
});