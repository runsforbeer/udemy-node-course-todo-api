const {MongoClient, ObjectID} = require('mongodb'); // the ES6 object destructuring way

MongoClient.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp', (err, db) => {
    if(err) {
        return console.log('There was an error connecting to the db: ' + err);
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a5d7dd2734d1d3471846d1f')
    // }, {
    //     $set: { // must use this mongodb operator
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a6002e5f36d280c7f1aae74')
    }, {
        $set: { name: "Don Marsh" },
        $inc: { age: 1 }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
    return;
});