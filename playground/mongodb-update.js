const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db server');
    }
    console.log('Connected to mongodb server');

    let db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bec2de14a0a37af1adaca6c')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log(err, 'error');
    // })

    // updating a document 
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5bec7d85dab4cd9f5ec9579a")
    }, {
        $set: {
            name: 'Daniel'
        },
        $inc: {
            age: -2
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    },  (err) => {
        console.log(err, 'error');
    });

    //  client.close();
}); 