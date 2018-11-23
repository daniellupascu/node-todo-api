require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=> {
        res.send(doc);
    }, (e) => {
        res.status(400);
        res.send('Could not save the todo');
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        if(todos.length > 0) {
            res.send({todos});
        } else {
            res.send('There are no todos');
        }
    }, (e) => {
        res.status(400).send('Could not fetch all the todos');
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.findById(id).then( todo => {
            todo ? res.send({todo}) : res.status(404).send('No todo with this id');
        }).catch(e => {
            res.status(400).send('Could not retreive todo');
        })
    } else {
        res.status(400).send('The provided id is not valid')
    }
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.findByIdAndDelete(id).then( todo => {
            if(todo) {
                res.send({todo});
            } else {
                res.status(404).send('There are no todos with this id');
            }
        }).catch(e => {
            res.status(400).send(`Could not delete todo`);
        });
    } else {
        res.status(400).send('The provided id is not valid');
    }
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']); 

    if(!ObjectID.isValid(id)) {
        return res.status(400).send('The provided id is not valid');
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( todo => {
        if(todo) {
            res.send({todo});
        } else {
            return res.status(404).send();
        }
    }).catch(e => res.status(400).send());

});


app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(`Could not create user ${e}`);
    });

})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

