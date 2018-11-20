const {mongoose} = require('../server/db/mongoose');
const {ObjectId} = require('mongodb');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '15bf46a561f44c2855d79f322';
var userId = '5bedd6989b9e5cf50bbaf994';

// Todo.find({_id: id}).then((docs) => {
//     console.log(docs);
// }, (e) => {
//     console.log('Error', e);
// });

// if(!ObjectId.isValid(id)) {
//     console.log('Id not valid');
// } else {

//     Todo.findById(id).then(doc => {
//         if(!doc) {
//             return console.log('Id not found');
//         }
//         console.log('by id', doc);
//     }).catch(e => console.log(e));
// }

if(ObjectId.isValid(userId)) {
    User.findById(userId).then(user => {
        if(user) {
            console.log(user);
        } else {
            console.log('No users with this id');
        }
    }).catch(e => {
        console.log('Could not retreive user by id', e);
    });
} else {
    console.log('User id not valid');
}