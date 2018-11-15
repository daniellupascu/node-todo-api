const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db server');
    }
    console.log('Connected to mongodb server');

    let db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5beb2071c609506bf89586c8')
    // }).toArray().then((docs) => {
    //     console.log('TOdos:')
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('unable to fetch todos', err)
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('unable to count todos', err)
    // });

    db.collection('Users').find({
        name: 'Daniel'
    }).toArray().then((docs) => {
        if(docs.length > 0) {
            console.log(JSON.stringify(docs, undefined, 2));
        } else {
            console.log('Could not find the docs in the collection');
        }
    }, (err) => {
        console.log('Could not find documents in the database', err);
    });

    //  client.close();
}); 