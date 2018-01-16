const {MongoClient, ObjectID} = require('mongodb'); // the ES6 object destructuring way

MongoClient.connect('mongodb://don:don@ds255767.mlab.com:55767/todoapp', (err, db) => {
    if(err) {
        return console.log('There was an error connecting to the db: ' + err);
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    // deleteone
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed:false
    // }).then((result) => {
    //     console.log(result);
    // });

    const userCollection = db.collection('Users');

    userCollection.deleteMany({name:'Don Marsh'}).then((result) => {
        console.log(result);
    });

    userCollection.findOneAndDelete({_id:new ObjectID('5a5d7fa7734d1d3471846dd0')}).then((result) => {
        console.log(result);
    })

    //db.close();
    return;
});