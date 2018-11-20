var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
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

app.listen('3000', () => {
    console.log('Started on port 3000');
});

module.exports = {app};

