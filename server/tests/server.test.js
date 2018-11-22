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
        text: 'Second test todo',
        completed: true,
        completedAt: 42342345,
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

describe('GET /todos/:id', () => {
    it('should get todo with the provided id', done => {
        request(app)
            .get(`/todos/${seededTodos[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(seededTodos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('No todo with this id')
            })
            .end(done);
    });

    it('should return 400 and error message if the id is not valid', done => {
        request(app)
            .get(`/todos/1235`)
            .expect(400)
            .expect(res => {
                expect(res.text).toBe('The provided id is not valid');
            })
            .end(done);
    });

});

describe('DELETE /todos', () => {
    it('should delete the todo with the provided id', done => {
        request(app)
            .delete(`/todos/${seededTodos[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.id).toBe(seededTodos[0].id)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(seededTodos[0]._id).then( todo => {
                    expect(todo).toBeNull()
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('There are no todos with this id')
            })
            .end(done);
    });

    it('should return 400 and error message if the id is not valid', done => {
        request(app)
            .delete('/todos/12333')
            .expect(400)
            .expect(res => {
                expect(res.text).toBe('The provided id is not valid')
            })
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        let text = 'updated text from tests';
        let completed = true;
        request(app)
            .patch(`/todos/${seededTodos[0]._id}`)
            .send({text, completed})
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(completed);
                expect(typeof(res.body.todo.completedAt)).toBe('number');
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(seededTodos[0]._id).then(todo => {
                    expect(todo.completed).toBe(completed);
                    expect(todo.text).toBe(text);
                    done();
                }).catch(e => done(e));

            });
    });

    it('should clear completedAt when todo is not completed', done => {
        request(app)
            .patch(`/todos/${seededTodos[1]._id}`)
            .send({completed: false})
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(seededTodos[1]._id).then(todo => {
                    expect(todo.completedAt).toBeNull();
                    expect(todo.completed).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });

});