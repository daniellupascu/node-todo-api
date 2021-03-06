require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });

    todo.save().then((doc)=> {
        res.send(doc);
    }, (e) => {
        res.status(400);
        res.send('Could not save the todo');
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        if(todos.length > 0) {
            res.send({todos});
        } else {
            res.send('There are no todos');
        }
    }, (e) => {
        res.status(400).send('Could not fetch all the todos');
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.find({
            _id: id,
            _creator: req.user._id
        }).then( todo => {
            todo.length > 0 ? res.send({todo}) : res.status(404).send('No todo with this id');
        }).catch(e => {
            res.status(400).send(`Could not retreive todo ${e}`);
        })
    } else {
        res.status(400).send('The provided id is not valid')
    }
});


app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(ObjectID.isValid(id)) {
        Todo.findOneAndDelete({
            _id: id,
            _creator: req.user._id
        }).then( todo => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id, 
        _creator: req.user._id
    }, 
    {$set: body}, {new: true}).then( todo => {
        if(todo) {
            res.send({todo});
        } else {
            return res.status(404).send();
        }
    }).catch(e => res.status(400).send());

});
 
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(`Cannot not create user ${e}`);
    });

});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(e => {
        res.status(400).send(e);
    });

});

app.delete('/users/me/token', authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (e => {
        res.status(400).send();
    }));
});

app.get('/test', (req, res) => {
    res.status(200).send('this is a test');
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

