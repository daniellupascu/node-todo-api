const {mongoose} = require('../server/db/mongoose');
const {ObjectId} = require('mongodb');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.deleteMany({}).then(result => {
//     console.log(result);
// });

Todo.findOneAndDelete('5bf56d763bcbcc32b1f252b2').then(doc => {
    console.log(doc);
});