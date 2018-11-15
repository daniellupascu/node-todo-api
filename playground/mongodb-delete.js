const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db server');
    }
    console.log('Connected to mongodb server');

    let db = client.db('TodoApp');

    // db.collection('Users').deleteMany({
    //     name: 'Daniel'
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('error', err);
    // });
    
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5bec7d7bf7f7da9f4a4768cf')
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log(err, 'error');
    });

    //  client.close();
}); 