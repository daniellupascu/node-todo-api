const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const seededTodos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo'
    }
];

beforeEach(done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(seededTodos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a todo', ( ) => {
        var text = 'test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(seededTodos.length);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( res => {
                expect(res.body.todos.length).toBe(seededTodos.length);
            })
            .end(done);
    });
});

describe('GET /todo/:id', () => {
    it('should get todo with the provided id', done => {
        request(app)
            .get(`/todo/${seededTodos[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(seededTodos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todo/${new ObjectID()}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('No todo with this id')
            })
            .end(done);
    });

    it('should return 400 and error message if the id is not valid', done => {
        request(app)
            .get(`/todo/1235`)
            .expect(400)
            .expect(res => {
                expect(res.text).toBe('The provided id is not valid');
            })
            .end(done);
    });

});