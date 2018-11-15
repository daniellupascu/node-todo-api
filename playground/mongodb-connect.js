 const {MongoClient, ObjectID} = require('mongodb');

 MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
     if(err) {
         return console.log('Unable to connect to mongo db server');
     }
     console.log('Connected to mongodb server');

    //  const db = client.db('TodoApp');

    //  db.collection('Todos').insertOne({
    //      text: 'resume work',
    //      completed: false
    //  }, (err, result) => {
    //     if(err) {
    //         return console('Unable to insert in the db', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //  });

    // db.collection('Users').insertOne({
    //     name: 'Richard',
    //     age: 24,
    //     location: 'Copenhagen'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Could not insert user in the database', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //  client.close();

 }); 