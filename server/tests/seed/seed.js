const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const seededTodos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 42342345,
    }
];

const populateTodos = done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(seededTodos);
    }).then(() => done())
    .catch(e => console.log(e));
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const seededUsers = [{
    _id: userOneId,
    email: 'valid@user.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userOneId, access: 'auth'}, 'abc123'),
    }]
},
{
    _id: userTwoId,
    email: 'invalid@user.com',
    password: 'user2pass'
}];

const populateUsers = done => {
    User.remove({}).then(() => {
        let user1 = new User(seededUsers[0]).save();
        let user2 = new User(seededUsers[1]).save();

        return Promise.all([user1, user2]);
    }).then(() => done());
}

module.exports = {populateTodos, seededTodos, populateUsers, seededUsers};
