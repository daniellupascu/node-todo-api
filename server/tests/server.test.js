const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {populateTodos, seededTodos, populateUsers, seededUsers} = require('./seed/seed');

beforeEach(populateUsers);

beforeEach(populateTodos);

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

describe('GET /user/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', seededUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(seededUsers[0]._id.toString());
                expect(res.body.email).toBe(seededUsers[0].email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(res.body._id).then(user => {
                    expect(user.email).toBe(seededUsers[0].email);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .send(seededUsers[1])
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        let user = {
            email: 'valid2@gmail.com',
            password: '123123qwe'
        };
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect(res => {
                expect(res.headers).toHaveProperty('x-auth');
                expect(res.body.email).toBe(user.email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(res.body._id).then(newUser => {
                    expect(newUser).toBeTruthy();
                    expect(newUser.password).not.toBe(user.password);
                    expect(newUser.email).toBe(user.email);
                    done();
                }).catch(e => done(e));
            });

    });

    it('should return validation error if req invalid', done => {
        let invalidUser = {
            email: 'valid2gmail.com',
            password: '123'
        };
        request(app)
            .post('/users')
            .send(invalidUser)
            .expect(400)
            .expect(res => {
                expect(res.text).toContain('ValidationError:');
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email: invalidUser.email}).then(user => {
                    expect(user).toBeFalsy();
                    done();
                }).catch(e => done(e));

            });
    });

    it('should not create user if email in use', done => {
        let invalidUser = {
            email: seededUsers[0].email,
            password: '12333244'
        };
        request(app)
            .post('/users')
            .send(invalidUser)
            .expect(400)
            .expect(res => {
                expect(res.text).toContain('duplicate key');
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email: invalidUser.email}).then(user => {
                    expect(user).toBeTruthy();
                    done();
                }).catch(e => done(e));

            });
    });
});

describe('POST /users/login', () => {
    it('should return user and auth token if the credentials are valid', done => {
        request(app)
            .post('/users/login')
            .send(seededUsers[0])
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(seededUsers[0].email);
                expect(res.body._id).toBe(seededUsers[0]._id.toString());
                expect(res.headers).toHaveProperty('x-auth');
                // DUPLICATE
                // expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(res.body._id).then(user => {
                    expect(user.email).toBe(seededUsers[0].email);
                    expect(user.tokens[1].access).toBe('auth');
                    expect(user.tokens[1].token).toBe(res.headers['x-auth']);
                    done();
                }).catch(e => done(e));

            });
    });

    it('should reject invalid email', done => {
        let invalidUser = {
            ...seededUsers[1],
            email: 'random@email.com'
        }
        
        request(app)
            .post('/users/login')
            .send(invalidUser)
            .expect(400)
            .expect(res => {
                expect(res.headers).not.toHaveProperty('x-auth');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(invalidUser._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));

            });
    });

    it('should reject invalid password', done => {
        let invalidUser = {
            ...seededUsers[1],
            password: 'InvalidPass'
        }
        
        request(app)
            .post('/users/login')
            .send(invalidUser)
            .expect(400)
            .expect(res => {
                expect(res.headers).not.toHaveProperty('x-auth');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(invalidUser._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));

            });
    });

});

describe('DELETE /users/me/token', () => {
    it('shoudl remove auth token on logout', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', seededUsers[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(seededUsers[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    })
});